-- Migration 002: Services and Bookings
-- Description: Creates tables for consultant services, bookings, and payment tracking
-- Author: Proofr Team
-- Date: 2025-01-03

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
  
  -- Basic info
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Pricing tiers (e.g., [30, 50, 75] for Basic/Standard/Premium)
  prices NUMERIC(10,2)[] NOT NULL CHECK (array_length(prices, 1) > 0),
  price_descriptions TEXT[] CHECK (
    array_length(price_descriptions, 1) = array_length(prices, 1) OR 
    price_descriptions IS NULL
  ),
  
  -- Delivery settings
  delivery_type delivery_type NOT NULL,
  standard_turnaround_hours INTEGER DEFAULT 48 CHECK (standard_turnaround_hours > 0),
  duration_minutes INTEGER CHECK (duration_minutes > 0 OR delivery_type = 'async'),
  
  -- Rush delivery options
  rush_available BOOLEAN DEFAULT true,
  rush_turnarounds JSONB DEFAULT '{"1.5x": 24, "2x": 12, "3x": 6}',
  
  -- Capacity settings
  max_active_orders INTEGER DEFAULT 5 CHECK (max_active_orders > 0),
  is_active BOOLEAN DEFAULT true,
  
  -- Group session support
  allows_group_sessions BOOLEAN DEFAULT false,
  max_group_size INTEGER DEFAULT 1 CHECK (max_group_size >= 1),
  
  -- Stats
  total_bookings INTEGER DEFAULT 0 CHECK (total_bookings >= 0),
  avg_rating NUMERIC(3,2) CHECK (avg_rating >= 0 AND avg_rating <= 5),
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure at least one price exists
  CONSTRAINT prices_not_empty CHECK (array_length(prices, 1) > 0)
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  consultant_id UUID NOT NULL REFERENCES public.consultants(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  
  -- Pricing (with discount protection)
  base_price NUMERIC(10,2) NOT NULL CHECK (base_price > 0),
  price_tier TEXT,
  rush_multiplier NUMERIC(3,1) DEFAULT 1 CHECK (rush_multiplier IN (1, 1.5, 2, 3)),
  discount_code TEXT,
  discount_amount NUMERIC(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  final_price NUMERIC(10,2) NOT NULL CHECK (final_price >= 0),
  
  -- IMPORTANT: Ensure discount never makes price negative
  CONSTRAINT discount_not_exceed_price CHECK (discount_amount < final_price),
  
  -- Essay/Document details
  prompt_text TEXT, -- the assignment prompt/requirements
  essay_text TEXT, -- the actual essay/document content
  requirements_text TEXT, -- additional requirements from student
  google_doc_link TEXT,
  uploaded_files JSONB DEFAULT '[]', -- [{name, url, type, size}]
  
  -- Delivery tracking
  is_rush BOOLEAN DEFAULT false,
  promised_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  deliverables JSONB DEFAULT '[]', -- consultant's response files/links
  
  -- Scheduling (for scheduled services)
  scheduled_at TIMESTAMPTZ,
  calendly_event_url TEXT,
  meeting_link TEXT,
  
  -- Status tracking
  status booking_status DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES public.users(id),
  cancellation_reason TEXT,
  
  -- Credits earned (2% cashback)
  credits_earned NUMERIC(10,2) GENERATED ALWAYS AS (final_price * 0.02) STORED,
  
  -- Review (after completion)
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewed_at TIMESTAMPTZ,
  
  -- Group session support
  is_group_session BOOLEAN DEFAULT false,
  max_participants INTEGER DEFAULT 1,
  current_participants INTEGER DEFAULT 1,
  
  -- Refund handling
  refund_requested BOOLEAN DEFAULT false,
  refund_reason TEXT,
  refund_status TEXT CHECK (refund_status IN ('pending', 'approved', 'rejected', 'processed')),
  refund_amount NUMERIC(10,2) CHECK (refund_amount >= 0 AND refund_amount <= final_price),
  refunded_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure status transitions are valid
  CONSTRAINT valid_completion CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status != 'completed' AND completed_at IS NULL)
  ),
  CONSTRAINT valid_cancellation CHECK (
    (status = 'cancelled' AND cancelled_at IS NOT NULL) OR
    (status != 'cancelled' AND cancelled_at IS NULL)
  ),
  CONSTRAINT valid_review CHECK (
    (rating IS NOT NULL AND reviewed_at IS NOT NULL) OR
    (rating IS NULL AND reviewed_at IS NULL)
  )
);

-- Group session participants
CREATE TABLE public.group_session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(booking_id, student_id)
);

-- Discount codes
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Discount settings
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  
  -- Constraints
  minimum_purchase NUMERIC(10,2) DEFAULT 0,
  maximum_discount NUMERIC(10,2), -- cap for percentage discounts
  
  -- Validity
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  
  -- Usage limits
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0 CHECK (used_count >= 0),
  max_uses_per_user INTEGER DEFAULT 1,
  
  -- Scope
  consultant_id UUID REFERENCES public.consultants(id), -- null = platform-wide
  specific_services UUID[], -- null = all services
  
  -- Management
  created_by UUID NOT NULL REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure percentage discounts are reasonable
  CONSTRAINT reasonable_percentage CHECK (
    discount_type != 'percentage' OR discount_value <= 100
  ),
  -- Ensure used count doesn't exceed max
  CONSTRAINT usage_limit CHECK (
    max_uses IS NULL OR used_count <= max_uses
  )
);

-- Discount usage tracking
CREATE TABLE public.discount_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discount_code_id UUID NOT NULL REFERENCES public.discount_codes(id),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  discount_applied NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(booking_id) -- one discount per booking
);

-- Waitlist for busy consultants
CREATE TABLE public.consultant_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultant_id UUID NOT NULL REFERENCES public.consultants(id),
  student_id UUID NOT NULL REFERENCES public.students(id),
  service_id UUID REFERENCES public.services(id),
  
  position INTEGER NOT NULL CHECK (position > 0),
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(consultant_id, student_id, service_id)
);

-- Create indexes for performance
CREATE INDEX idx_services_consultant ON public.services(consultant_id);
CREATE INDEX idx_services_type ON public.services(service_type);
CREATE INDEX idx_services_active ON public.services(is_active);

CREATE INDEX idx_bookings_student ON public.bookings(student_id);
CREATE INDEX idx_bookings_consultant ON public.bookings(consultant_id);
CREATE INDEX idx_bookings_service ON public.bookings(service_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_scheduled ON public.bookings(scheduled_at);
CREATE INDEX idx_bookings_created ON public.bookings(created_at DESC);

CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX idx_discount_codes_active ON public.discount_codes(is_active);
CREATE INDEX idx_discount_codes_consultant ON public.discount_codes(consultant_id);

CREATE INDEX idx_waitlist_consultant ON public.consultant_waitlist(consultant_id);
CREATE INDEX idx_waitlist_student ON public.consultant_waitlist(student_id);
CREATE INDEX idx_waitlist_expires ON public.consultant_waitlist(expires_at);

-- Apply updated_at triggers
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate positive prices in array
CREATE OR REPLACE FUNCTION validate_positive_prices()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM unnest(NEW.prices) AS price WHERE price <= 0) THEN
    RAISE EXCEPTION 'All prices must be positive';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to validate prices
CREATE TRIGGER validate_service_prices
  BEFORE INSERT OR UPDATE OF prices ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION validate_positive_prices();

-- Create function to calculate final price
CREATE OR REPLACE FUNCTION calculate_booking_final_price(
  base_price NUMERIC,
  rush_multiplier NUMERIC,
  discount_amount NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
  RETURN GREATEST(0, (base_price * rush_multiplier) - discount_amount);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to update consultant stats after booking completion
CREATE OR REPLACE FUNCTION update_consultant_stats_on_booking_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.consultants
    SET 
      total_bookings = total_bookings + 1,
      total_earnings = total_earnings + NEW.final_price,
      rating = (
        SELECT AVG(rating)::NUMERIC(3,2)
        FROM public.bookings
        WHERE consultant_id = NEW.consultant_id
        AND status = 'completed'
        AND rating IS NOT NULL
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.bookings
        WHERE consultant_id = NEW.consultant_id
        AND status = 'completed'
        AND rating IS NOT NULL
      )
    WHERE id = NEW.consultant_id;
    
    -- Update service stats
    UPDATE public.services
    SET
      total_bookings = total_bookings + 1,
      avg_rating = (
        SELECT AVG(rating)::NUMERIC(3,2)
        FROM public.bookings
        WHERE service_id = NEW.service_id
        AND status = 'completed'
        AND rating IS NOT NULL
      )
    WHERE id = NEW.service_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_booking_complete
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_consultant_stats_on_booking_complete();

-- Create view for consultant earnings
CREATE VIEW public.consultant_earnings AS
SELECT 
  c.id,
  c.name,
  SUM(b.final_price) AS total_earnings,
  SUM(CASE WHEN b.is_rush THEN b.final_price ELSE 0 END) AS rush_earnings,
  COUNT(*) AS total_bookings,
  COUNT(CASE WHEN b.status = 'completed' THEN 1 END) AS completed_bookings,
  AVG(CASE WHEN b.rating IS NOT NULL THEN b.rating END)::NUMERIC(3,2) AS avg_rating,
  COUNT(CASE WHEN b.rating IS NOT NULL THEN 1 END) AS total_reviews
FROM public.consultants c
LEFT JOIN public.bookings b ON c.id = b.consultant_id
GROUP BY c.id, c.name;

-- Comments for documentation
COMMENT ON TABLE public.services IS 'Consultant service offerings with pricing tiers';
COMMENT ON TABLE public.bookings IS 'Service bookings between students and consultants';
COMMENT ON TABLE public.discount_codes IS 'Discount codes for services';
COMMENT ON TABLE public.consultant_waitlist IS 'Waitlist for fully booked consultants';

COMMENT ON COLUMN public.bookings.final_price IS 'Final price after rush multiplier and discounts (protected from negative values)';
COMMENT ON COLUMN public.bookings.credits_earned IS 'Automatically calculated as 2% of final price';