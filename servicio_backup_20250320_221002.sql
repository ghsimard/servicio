--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: action_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.action_type AS ENUM (
    'insert',
    'update',
    'delete'
);


ALTER TYPE public.action_type OWNER TO postgres;

--
-- Name: applies_to_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.applies_to_type AS ENUM (
    'service_price',
    'platform_commission',
    'service_fee',
    'all'
);


ALTER TYPE public.applies_to_type OWNER TO postgres;

--
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'canceled'
);


ALTER TYPE public.booking_status OWNER TO postgres;

--
-- Name: campaign_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.campaign_status AS ENUM (
    'active',
    'expired',
    'pending_payment'
);


ALTER TYPE public.campaign_status OWNER TO postgres;

--
-- Name: campaign_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.campaign_type AS ENUM (
    'promotion',
    'certification_marker',
    'priority_bump',
    'motivated_helper',
    'highlighted',
    'expanded_market',
    'extra_services',
    'realtime_location',
    'queue_system'
);


ALTER TYPE public.campaign_type OWNER TO postgres;

--
-- Name: cert_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cert_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'revoked'
);


ALTER TYPE public.cert_status OWNER TO postgres;

--
-- Name: certification_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.certification_status_type AS ENUM (
    'uncertified',
    'certified',
    'revoked'
);


ALTER TYPE public.certification_status_type OWNER TO postgres;

--
-- Name: contact_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.contact_type AS ENUM (
    'fax',
    'mobile',
    'iphone',
    'home',
    'work',
    'other_phone',
    'custom_phone',
    'email_personal',
    'email_work',
    'email_other',
    'facebook',
    'linkedin',
    'twitter',
    'instagram',
    'custom_social'
);


ALTER TYPE public.contact_type OWNER TO postgres;

--
-- Name: contract_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.contract_status AS ENUM (
    'draft',
    'sent',
    'signed',
    'rejected',
    'expired'
);


ALTER TYPE public.contract_status OWNER TO postgres;

--
-- Name: contract_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.contract_type AS ENUM (
    'service',
    'subscription',
    'custom'
);


ALTER TYPE public.contract_type OWNER TO postgres;

--
-- Name: entity_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.entity_type AS ENUM (
    'user',
    'helper_service',
    'booking',
    'rfp'
);


ALTER TYPE public.entity_type OWNER TO postgres;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'USER',
    'HELPER',
    'ADMIN',
    'user',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

--
-- Name: file_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.file_type AS ENUM (
    'pdf',
    'docx',
    'csv'
);


ALTER TYPE public.file_type OWNER TO postgres;

--
-- Name: invoice_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoice_status AS ENUM (
    'draft',
    'sent',
    'paid',
    'overdue',
    'canceled'
);


ALTER TYPE public.invoice_status OWNER TO postgres;

--
-- Name: jurisdiction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.jurisdiction_type AS ENUM (
    'municipal',
    'provincial',
    'federal',
    'sector_specific'
);


ALTER TYPE public.jurisdiction_type OWNER TO postgres;

--
-- Name: location_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.location_type AS ENUM (
    'international',
    'country',
    'state',
    'city',
    'neighborhood'
);


ALTER TYPE public.location_type OWNER TO postgres;

--
-- Name: log_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.log_action AS ENUM (
    'insert',
    'update',
    'delete'
);


ALTER TYPE public.log_action OWNER TO postgres;

--
-- Name: moderation_entity_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.moderation_entity_type AS ENUM (
    'account_photo',
    'listing_photo',
    'certification_proof',
    'rfp',
    'review',
    'message',
    'portfolio_photo',
    'gallery_photo'
);


ALTER TYPE public.moderation_entity_type OWNER TO postgres;

--
-- Name: moderation_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.moderation_status AS ENUM (
    'approved',
    'rejected',
    'pending'
);


ALTER TYPE public.moderation_status OWNER TO postgres;

--
-- Name: moderation_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.moderation_type AS ENUM (
    'image',
    'text'
);


ALTER TYPE public.moderation_type OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'booking_request',
    'booking_confirmation',
    'booking_cancellation',
    'message_received',
    'payment_received',
    'review_received',
    'system_notification'
);


ALTER TYPE public.notification_type OWNER TO postgres;

--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'credit_card',
    'bank_transfer',
    'crypto',
    'paypal'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'paid',
    'free'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- Name: plan_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.plan_type AS ENUM (
    'free',
    'premium',
    'enterprise'
);


ALTER TYPE public.plan_type OWNER TO postgres;

--
-- Name: proof_file_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.proof_file_type AS ENUM (
    'image',
    'pdf',
    'other'
);


ALTER TYPE public.proof_file_type OWNER TO postgres;

--
-- Name: remittance_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.remittance_status AS ENUM (
    'pending',
    'remitted'
);


ALTER TYPE public.remittance_status OWNER TO postgres;

--
-- Name: rfp_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rfp_status AS ENUM (
    'active',
    'expired',
    'completed',
    'canceled'
);


ALTER TYPE public.rfp_status OWNER TO postgres;

--
-- Name: role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_type AS ENUM (
    'needer',
    'helper',
    'admin'
);


ALTER TYPE public.role_type OWNER TO postgres;

--
-- Name: tax_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tax_status AS ENUM (
    'pending',
    'collected',
    'remitted'
);


ALTER TYPE public.tax_status OWNER TO postgres;

--
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_status AS ENUM (
    'pending',
    'held',
    'completed',
    'disputed',
    'canceled'
);


ALTER TYPE public.transaction_status OWNER TO postgres;

--
-- Name: translation_entity_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.translation_entity_type AS ENUM (
    'service',
    'company',
    'ui_element',
    'field_label',
    'tooltip',
    'title',
    'dropdown_value',
    'button',
    'calendar'
);


ALTER TYPE public.translation_entity_type OWNER TO postgres;

--
-- Name: user_role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_type AS ENUM (
    'needer',
    'helper',
    'admin'
);


ALTER TYPE public.user_role_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Helpers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Helpers" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    "businessName" character varying(255),
    services jsonb DEFAULT '[]'::jsonb NOT NULL,
    "yearsOfExperience" integer,
    age integer,
    languages jsonb DEFAULT '[]'::jsonb NOT NULL,
    rating double precision,
    gender character varying(255),
    certified boolean DEFAULT false NOT NULL,
    latitude double precision,
    longitude double precision,
    "createdAt" timestamp(6) with time zone NOT NULL,
    "updatedAt" timestamp(6) with time zone NOT NULL
);


ALTER TABLE public."Helpers" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    address_id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type public.entity_type NOT NULL,
    entity_id uuid NOT NULL,
    street character varying(255),
    city character varying(100),
    state character varying(100),
    postal_code character varying(20),
    country character varying(100) NOT NULL,
    latitude numeric(9,6),
    longitude numeric(9,6),
    is_primary boolean DEFAULT false,
    visibility jsonb DEFAULT '{"public": false}'::jsonb,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: admin_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_settings (
    setting_id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(100) NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_settings OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id uuid DEFAULT gen_random_uuid() NOT NULL,
    needer_id uuid NOT NULL,
    helper_service_id uuid NOT NULL,
    delivery_address_id uuid,
    queue_position integer,
    campaign_id uuid,
    start_time timestamp(6) without time zone,
    end_time timestamp(6) without time zone,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    commission numeric(10,2),
    transaction_id uuid,
    needer_confirmed boolean DEFAULT false,
    helper_confirmed boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    campaign_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    campaign_type public.campaign_type NOT NULL,
    entity_type public.entity_type NOT NULL,
    entity_id uuid NOT NULL,
    start_date timestamp(6) without time zone NOT NULL,
    end_date timestamp(6) without time zone NOT NULL,
    cost numeric(10,2) NOT NULL,
    status public.campaign_status DEFAULT 'pending_payment'::public.campaign_status,
    details jsonb,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- Name: certification_proofs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certification_proofs (
    proof_id uuid DEFAULT gen_random_uuid() NOT NULL,
    certification_id uuid NOT NULL,
    file_type public.proof_file_type NOT NULL,
    file_url character varying(255) NOT NULL,
    file_name character varying(100),
    uploaded_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.certification_proofs OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: content_moderation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_moderation (
    moderation_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    content_type public.moderation_type NOT NULL,
    entity_type public.moderation_entity_type NOT NULL,
    entity_id uuid NOT NULL,
    content_value text,
    ia_score numeric(3,2),
    ia_status public.moderation_status DEFAULT 'pending'::public.moderation_status,
    admin_status public.moderation_status DEFAULT 'pending'::public.moderation_status,
    moderation_comments text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.content_moderation OWNER TO postgres;

--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    contract_id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    needer_id uuid NOT NULL,
    helper_id uuid NOT NULL,
    contract_type public.contract_type NOT NULL,
    status public.contract_status DEFAULT 'draft'::public.contract_status,
    contract_url character varying(255),
    signed_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    terms text,
    signature_needer jsonb,
    signature_helper jsonb,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: database_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.database_logs (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    table_name character varying(50) NOT NULL,
    action public.action_type NOT NULL,
    record_id uuid NOT NULL,
    details jsonb,
    operation_details jsonb,
    "timestamp" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.database_logs OWNER TO postgres;

--
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_rates (
    exchange_rate_id uuid DEFAULT gen_random_uuid() NOT NULL,
    from_currency character varying(10) NOT NULL,
    to_currency character varying(10) NOT NULL,
    rate numeric(15,6) NOT NULL,
    effective_date timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exchange_rates OWNER TO postgres;

--
-- Name: exports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exports (
    export_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    entity_type public.entity_type NOT NULL,
    entity_id uuid NOT NULL,
    file_type public.file_type DEFAULT 'pdf'::public.file_type,
    file_url character varying(255),
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    downloaded boolean DEFAULT false
);


ALTER TABLE public.exports OWNER TO postgres;

--
-- Name: helper_certifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.helper_certifications (
    certification_id uuid DEFAULT gen_random_uuid() NOT NULL,
    helper_id uuid NOT NULL,
    admin_id uuid,
    status public.cert_status DEFAULT 'pending'::public.cert_status,
    evaluation_date timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    evaluation_comments text,
    proof_required boolean DEFAULT true,
    start_date timestamp(6) without time zone,
    end_date timestamp(6) without time zone,
    is_visible boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.helper_certifications OWNER TO postgres;

--
-- Name: helper_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.helper_services (
    helper_service_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    service_id uuid NOT NULL,
    address_id uuid,
    active_campaign_id uuid,
    price numeric(10,2),
    availability jsonb,
    location_type public.location_type,
    location_details jsonb,
    listing_photo_url character varying(255),
    gallery_id character varying(24),
    visibility jsonb DEFAULT '{"photo": true, "price": true, "address": true, "contacts": true, "location": true, "availability": true}'::jsonb,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.helper_services OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    invoice_id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    needer_id uuid NOT NULL,
    helper_id uuid NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    commission_amount numeric(10,2) NOT NULL,
    helper_amount numeric(10,2) NOT NULL,
    service_fee numeric(10,2),
    total_taxes numeric(10,2) DEFAULT 0.00,
    currency character varying(10) DEFAULT 'EUR'::character varying NOT NULL,
    status public.invoice_status DEFAULT 'draft'::public.invoice_status,
    issued_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp(6) without time zone,
    paid_at timestamp(6) without time zone,
    invoice_url character varying(255),
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    message_id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    booking_id uuid,
    content text,
    sent_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    read boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: realtime_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realtime_locations (
    location_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    "timestamp" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    campaign_id uuid
);


ALTER TABLE public.realtime_locations OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    rating integer,
    comment text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: rfp_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rfp_notifications (
    notification_id uuid DEFAULT gen_random_uuid() NOT NULL,
    rfp_id uuid NOT NULL,
    helper_id uuid NOT NULL,
    sent_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    read boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rfp_notifications OWNER TO postgres;

--
-- Name: rfps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rfps (
    rfp_id uuid DEFAULT gen_random_uuid() NOT NULL,
    needer_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    service_id uuid NOT NULL,
    details text,
    expiration_date timestamp(6) without time zone,
    status public.rfp_status DEFAULT 'active'::public.rfp_status,
    payment_status public.payment_status DEFAULT 'free'::public.payment_status,
    price numeric(10,2) DEFAULT 0.00,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rfps OWNER TO postgres;

--
-- Name: services; Type: TABLE; Schema: public; Owner: ghsimard
--

CREATE TABLE public.services (
    service_id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_service_id uuid,
    level integer NOT NULL,
    name_en character varying(100) NOT NULL,
    name_fr character varying(100),
    name_es character varying(100),
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.services OWNER TO ghsimard;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    subscription_id uuid DEFAULT gen_random_uuid() NOT NULL,
    needer_id uuid NOT NULL,
    plan_type public.plan_type NOT NULL,
    start_date timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    end_date timestamp(6) without time zone,
    features jsonb NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: tax_remittances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_remittances (
    remittance_id uuid DEFAULT gen_random_uuid() NOT NULL,
    tax_rule_id uuid NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    currency character varying(10) DEFAULT 'EUR'::character varying NOT NULL,
    period_start timestamp(6) without time zone NOT NULL,
    period_end timestamp(6) without time zone NOT NULL,
    remitted_at timestamp(6) without time zone,
    status public.remittance_status DEFAULT 'pending'::public.remittance_status,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tax_remittances OWNER TO postgres;

--
-- Name: tax_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rules (
    tax_rule_id uuid DEFAULT gen_random_uuid() NOT NULL,
    jurisdiction_type public.jurisdiction_type NOT NULL,
    jurisdiction_code character varying(50) NOT NULL,
    sector_code character varying(50),
    tax_name character varying(100) NOT NULL,
    tax_rate numeric(5,2) NOT NULL,
    applies_to public.applies_to_type NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tax_rules OWNER TO postgres;

--
-- Name: transaction_taxes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_taxes (
    transaction_tax_id uuid DEFAULT gen_random_uuid() NOT NULL,
    transaction_id uuid NOT NULL,
    tax_rule_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    taxable_amount numeric(10,2) NOT NULL,
    currency character varying(10) DEFAULT 'EUR'::character varying NOT NULL,
    collected_from character varying(10) NOT NULL,
    status public.tax_status DEFAULT 'pending'::public.tax_status,
    remitted_at timestamp(6) without time zone,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transaction_taxes OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    invoice_id uuid,
    needer_id uuid NOT NULL,
    helper_id uuid NOT NULL,
    total_amount numeric(10,2),
    commission_amount numeric(10,2),
    helper_amount numeric(10,2),
    service_fee numeric(10,2),
    currency character varying(10) DEFAULT 'EUR'::character varying NOT NULL,
    helper_location_id uuid,
    needer_location_id uuid,
    status public.transaction_status DEFAULT 'pending'::public.transaction_status,
    payment_method public.payment_method,
    payment_details jsonb,
    needer_confirmed boolean DEFAULT false,
    helper_confirmed boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp(6) without time zone
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translations (
    translation_id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type public.translation_entity_type NOT NULL,
    entity_id uuid NOT NULL,
    language character varying(10) NOT NULL,
    translated_text text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.translations OWNER TO postgres;

--
-- Name: user_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_contacts (
    contact_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    contact_type public.contact_type NOT NULL,
    contact_value character varying(255) NOT NULL,
    extension character varying(20),
    label character varying(50),
    is_verified boolean DEFAULT false,
    visibility boolean DEFAULT true,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_contacts OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_role_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.role_type NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    lastname2 character varying(100),
    dob date,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    preferred_language character varying(10) DEFAULT 'en'::character varying,
    profile_photo_url character varying(255),
    subscription_id uuid,
    company_id uuid,
    primary_address_id uuid,
    certification_status public.certification_status_type DEFAULT 'uncertified'::public.certification_status_type,
    last_certified_at timestamp(6) without time zone,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    gender character varying(20),
    title character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_tokens (
    token_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    type character varying(50) DEFAULT 'email_verification'::character varying NOT NULL,
    expires_at timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO postgres;

--
-- Data for Name: Helpers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Helpers" (id, name, email, phone, "businessName", services, "yearsOfExperience", age, languages, rating, gender, certified, latitude, longitude, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
06511d63-73a5-48e1-b5c4-56f8044053a6	51df4bb6ca3fda3414b924fd13a3181a3a9be82d9b92f5c589809e92d5b46ed6	2025-03-18 09:10:06.941229-05	20250318125705_add_user_profile_fields	\N	\N	2025-03-18 09:10:06.877334-05	1
79a84bb1-add4-45b5-92ef-cee19a913f21	1e6547905bd6a46cbecf32470f20ccfa4fbb2ab9b51bd188394c746429f7daf3	2025-03-18 09:10:06.942998-05	20250318131101_add_user_title_and_gender	\N	\N	2025-03-18 09:10:06.941724-05	1
\.


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (address_id, entity_type, entity_id, street, city, state, postal_code, country, latitude, longitude, is_primary, visibility, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: admin_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_settings (setting_id, key, value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, needer_id, helper_service_id, delivery_address_id, queue_position, campaign_id, start_time, end_time, status, commission, transaction_id, needer_confirmed, helper_confirmed, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (campaign_id, user_id, campaign_type, entity_type, entity_id, start_date, end_date, cost, status, details, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: certification_proofs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certification_proofs (proof_id, certification_id, file_type, file_url, file_name, uploaded_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: content_moderation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content_moderation (moderation_id, user_id, content_type, entity_type, entity_id, content_value, ia_score, ia_status, admin_status, moderation_comments, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (contract_id, booking_id, needer_id, helper_id, contract_type, status, contract_url, signed_at, expires_at, terms, signature_needer, signature_helper, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: database_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.database_logs (log_id, user_id, table_name, action, record_id, details, operation_details, "timestamp") FROM stdin;
\.


--
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exchange_rates (exchange_rate_id, from_currency, to_currency, rate, effective_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: exports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exports (export_id, user_id, entity_type, entity_id, file_type, file_url, created_at, updated_at, downloaded) FROM stdin;
\.


--
-- Data for Name: helper_certifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.helper_certifications (certification_id, helper_id, admin_id, status, evaluation_date, evaluation_comments, proof_required, start_date, end_date, is_visible, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: helper_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.helper_services (helper_service_id, user_id, service_id, address_id, active_campaign_id, price, availability, location_type, location_details, listing_photo_url, gallery_id, visibility, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (invoice_id, booking_id, needer_id, helper_id, total_amount, commission_amount, helper_amount, service_fee, total_taxes, currency, status, issued_at, due_date, paid_at, invoice_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (message_id, sender_id, receiver_id, booking_id, content, sent_at, read, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: realtime_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.realtime_locations (location_id, user_id, latitude, longitude, "timestamp", campaign_id) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, booking_id, rating, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: rfp_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rfp_notifications (notification_id, rfp_id, helper_id, sent_at, read, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: rfps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rfps (rfp_id, needer_id, title, service_id, details, expiration_date, status, payment_status, price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: ghsimard
--

COPY public.services (service_id, parent_service_id, level, name_en, name_fr, name_es, is_active, metadata, created_at, updated_at) FROM stdin;
b115ce68-7b23-4422-ae8a-6738918ac4d9	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Cleaning windows	Nettoyage des fenêtres	Limpieza de ventanas	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
078b8ffe-2045-4534-a86e-094ff0f2e80b	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Wiping down appliances	Essuyer les appareils électroménagers	Limpieza de electrodomésticos	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
68ea0e36-0266-4923-9016-a4cbf1e2e893	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Sanitizing doorknobs	Désinfection des poignées de porte	Desinfección de pomos de puertas	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
d8549922-17e6-4892-b90e-d6f4dabd43d7	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Emptying trash bins	Vider les poubelles	Vaciar los contenedores de basura	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
e459745f-553e-49b6-b40f-a96a94c56372	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Washing dishes	Faire la vaisselle	Lavar platos	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
9b9e4766-48db-40db-b7a4-dabae398a111	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Scrubbing sinks	Récurer les éviers	Fregar fregaderos	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
d1a29897-0170-40a2-8c02-9ca23d22cb7e	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Cleaning oven interiors	Nettoyage de l'intérieur du four	Limpieza del interior del horno	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
247187ed-dccb-4644-a4ed-170b58617b38	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Wiping refrigerator shelves	Essuyer les étagères du réfrigérateur	Limpiar los estantes del refrigerador	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
6980ba15-9939-4ff4-a78a-427f92ad8777	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Organizing pantry	Organisation du garde-manger	Organizar la despensa	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
535c18e7-8cb3-47e8-bd5b-9dfc4ec9d34e	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Sanitizing cutting boards	Désinfection des planches à découper	Desinfección de tablas de cortar	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
95a77299-7aa7-4514-b7e8-c4ac6cab833b	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Scrubbing toilets	Nettoyage des toilettes	Fregar inodoros	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
1c57484d-9455-4b8b-92d1-4f2371310d83	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Cleaning showers	Nettoyage des douches	Limpieza de duchas	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
679ed49c-1fe7-4bc5-aac8-dfc494ab1965	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Washing bath mats	Laver les tapis de bain	Lavar alfombras de baño	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
b3466ba6-9f62-4da1-b7a7-cfd977fe14ad	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Wiping mirrors	Essuyer les miroirs	Limpiar espejos	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
025e5e06-97f9-486c-819b-7b2d3c043de1	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Sanitizing sinks	Désinfection des éviers	Desinfección de fregaderos	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
cbd30b2e-8b1c-485a-84f1-63fdae5a616c	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Replacing towels	Remplacement des serviettes	Reemplazo de toallas	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
8cc22cfa-7f37-43ce-8747-6280f54fdc35	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Emptying bathroom trash	Vider la poubelle de la salle de bain	Vaciar la basura del baño	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
d05975ea-c145-4519-a0bc-2a1396f1cd7c	bd28d28b-44d9-4927-9bf8-6b48bf58217e	3	Upholstery cleaning	Nettoyage de tissus d'ameublement	Limpieza de tapicería	t	\N	2025-03-15 19:13:57.376066	2025-03-15 19:13:57.376066
35cc40ff-6c7c-4965-9d3f-fd2722db30f7	bd28d28b-44d9-4927-9bf8-6b48bf58217e	3	Curtain washing	Lavage des rideaux	Lavado de cortinas	t	\N	2025-03-15 19:13:57.376066	2025-03-15 19:13:57.376066
f007ca3a-3e05-40bf-9f95-82aefabc03b5	bd28d28b-44d9-4927-9bf8-6b48bf58217e	3	Mattress sanitizing	Désinfection des matelas	Desinfección de colchones	t	\N	2025-03-15 19:13:57.376066	2025-03-15 19:13:57.376066
46e14359-d129-4444-9247-d36339f515d5	10cb4619-2e98-40b7-84b7-a6609cc9e209	2	Plumbing	Plomberie	Plomería	t	\N	2025-03-15 19:14:18.877021	2025-03-15 19:14:18.877021
8ed5bbed-4515-4d47-9406-878b00cbc239	10cb4619-2e98-40b7-84b7-a6609cc9e209	2	Electrical	Électrique	Eléctrico	t	\N	2025-03-15 19:14:18.877021	2025-03-15 19:14:18.877021
af113e03-ac2c-4be2-bef4-832ea1b3d599	10cb4619-2e98-40b7-84b7-a6609cc9e209	2	HVAC	CVC	Climatización	t	\N	2025-03-15 19:14:18.877021	2025-03-15 19:14:18.877021
37872f87-217f-4b7e-9e93-2d9098389fbb	46e14359-d129-4444-9247-d36339f515d5	3	Fixing leaky faucets	Réparer les robinets qui fuient	Arreglar grifos que gotean	t	\N	2025-03-15 19:15:15.531196	2025-03-15 19:15:15.531196
19a9ae61-d584-4f16-9bcc-8ad49aaf70a8	46e14359-d129-4444-9247-d36339f515d5	3	Unclogging drains	Débouchage des canalisations	Desatascar desagües	t	\N	2025-03-15 19:15:15.531196	2025-03-15 19:15:15.531196
883aeba8-cfff-4521-a307-6560571a7d22	46e14359-d129-4444-9247-d36339f515d5	3	Replacing showerheads	Remplacement des pommes de douche	Reemplazo de cabezales de ducha	t	\N	2025-03-15 19:15:15.531196	2025-03-15 19:15:15.531196
43828e30-7fdf-495c-b390-06bffcc3241d	8ed5bbed-4515-4d47-9406-878b00cbc239	3	Replacing light bulbs	Remplacement des ampoules	Sustitución de bombillas	t	\N	2025-03-15 19:15:40.077105	2025-03-15 19:15:40.077105
532a9395-8b81-46fe-a79b-8a70e38b58ba	8ed5bbed-4515-4d47-9406-878b00cbc239	3	Fixing outlets	Réparer les prises	Reparación de enchufes	t	\N	2025-03-15 19:15:40.077105	2025-03-15 19:15:40.077105
d320b8de-0be4-4cf3-9cb9-3acb09f895a4	8ed5bbed-4515-4d47-9406-878b00cbc239	3	Repairing wiring	Réparation du câblage	Reparación del cableado	t	\N	2025-03-15 19:15:40.077105	2025-03-15 19:15:40.077105
f17c43bf-6328-4679-8d2c-fac71d3f3e1c	8ed5bbed-4515-4d47-9406-878b00cbc239	3	Setting up smart lighting	Mise en place d'un éclairage intelligent	Configuración de iluminación inteligente	t	\N	2025-03-15 19:15:40.077105	2025-03-15 19:15:40.077105
73cf1640-a3ad-488d-9671-1042772f8fd3	af113e03-ac2c-4be2-bef4-832ea1b3d599	3	Cleaning vents	Nettoyage des bouches d'aération	Limpieza de conductos de ventilación	t	\N	2025-03-15 19:15:59.411226	2025-03-15 19:15:59.411226
c37021a9-0001-4e18-8fde-23bae7f3bd3f	af113e03-ac2c-4be2-bef4-832ea1b3d599	3	Servicing air conditioners	Entretien des climatiseurs	Servicio de aires acondicionados	t	\N	2025-03-15 19:15:59.411226	2025-03-15 19:15:59.411226
ae5b78ea-b802-4d58-9e0f-4657972a826e	af113e03-ac2c-4be2-bef4-832ea1b3d599	3	Installing thermostats	Installation de thermostats	Instalación de termostatos	t	\N	2025-03-15 19:15:59.411226	2025-03-15 19:15:59.411226
e82ac15d-d3a9-4fd3-93c1-850948d0b098	4205c004-e873-427d-882b-0c6e66244aa9	3	Patching drywall	Réparation de cloisons sèches	Parcheo de paneles de yeso	t	\N	2025-03-15 19:16:21.283601	2025-03-15 19:16:21.283601
c50fd244-1fff-49b6-ad05-434eadc29eb7	4205c004-e873-427d-882b-0c6e66244aa9	3	Repairing door hinges	Réparation des charnières de porte	Reparación de bisagras de puertas	t	\N	2025-03-15 19:16:21.283601	2025-03-15 19:16:21.283601
39b5bb1c-77c5-4229-a139-1b6a17d8cdc8	4205c004-e873-427d-882b-0c6e66244aa9	3	Sealing window leaks	Sceller les fuites des fenêtres	Sellado de fugas de ventanas	t	\N	2025-03-15 19:16:21.283601	2025-03-15 19:16:21.283601
a9f9970f-adf6-4abd-aa15-946139d5389f	d15b7952-0cb3-40ce-9585-214614486f4a	2	Painting	Peinture	Cuadro	t	\N	2025-03-15 19:16:52.047188	2025-03-15 19:16:52.047188
59967254-1c47-4f46-a8fc-a754777bd43a	d15b7952-0cb3-40ce-9585-214614486f4a	2	Renovation	Rénovation	Renovación	t	\N	2025-03-15 19:16:52.047188	2025-03-15 19:16:52.047188
bcdcaa91-8d3b-41a0-b48a-b09969f009c7	d15b7952-0cb3-40ce-9585-214614486f4a	2	Decorating	Décoration	Decorando	t	\N	2025-03-15 19:16:52.047188	2025-03-15 19:16:52.047188
9699cb28-5301-41ce-8cca-093739d01ddb	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Cleaning Services	Services de nettoyage	Servicios de limpieza	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
d15b7952-0cb3-40ce-9585-214614486f4a	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Home Improvement Services	Services de rénovation domiciliaire	Servicios de mejoras para el hogar	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
019a3526-faee-4247-a2c7-e118b94223ff	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Organizational Services	Services organisationnels	Servicios Organizacionales	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
fb0ed9a3-0d30-4246-9779-d677850b5fc9	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Pest Control Services	Services de lutte antiparasitaire	Servicios de control de plagas	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
c3512291-968b-4b42-8e2d-5bfdb33caa2a	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Personal and Family Services	Services personnels et familiaux	Servicios personales y familiares	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
46159599-356b-411a-b2f9-3e971fdffa27	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Security Services	Services de sécurité	Servicios de seguridad	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
71c33d81-9a87-46de-a596-edd215ab7a7e	9699cb28-5301-41ce-8cca-093739d01ddb	2	Interior Cleaning	Nettoyage intérieur	Limpieza de interiores	t	\N	2025-03-15 19:10:54.586227	2025-03-15 19:10:54.586227
2e869a00-c1f8-4e0a-9f48-f8790939f17e	9699cb28-5301-41ce-8cca-093739d01ddb	2	Kitchen Cleaning	Nettoyage de la cuisine	Limpieza de cocina	t	\N	2025-03-15 19:10:54.586227	2025-03-15 19:10:54.586227
88949e1f-d5f4-4219-a04d-9f32088d60b2	\N	0	Household Services	Services aux ménages	Servicios para el hogar	t	\N	2025-03-15 19:09:37.540732	2025-03-15 19:09:37.540732
63a9d17d-0150-4721-951f-3f0f863ca46c	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Mopping hard surfaces	Nettoyage des surfaces dures	Fregar superficies duras	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
92a6df6f-5888-4b9b-a2b4-b00c36f9a1d3	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Polishing mirrors	Polissage des miroirs	Pulido de espejos	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
5d8d1233-0d36-4a8f-b6e3-0937a7a200e9	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Cleaning light fixtures	Nettoyage des luminaires	Limpieza de artefactos de iluminación	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
90a3f379-e24f-4cf6-9134-7c7dde612aca	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Cleaning countertops	Nettoyage des comptoirs	Limpieza de encimeras	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
1ca36fed-75d1-49df-a846-45375daa2186	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Degreasing stovetops	Dégraissage des plaques de cuisson	Desengrasar estufas	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
149dc049-0317-4e2d-b1b1-0e8ff51c297d	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Cleaning microwave	Nettoyage du micro-ondes	Limpieza del microondas	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
33e927fd-0a3a-4af6-9191-49cb0a6391c5	2e869a00-c1f8-4e0a-9f48-f8790939f17e	3	Cleaning cabinet exteriors	Nettoyage de l'extérieur des armoires	Limpieza del exterior de los gabinetes	t	\N	2025-03-15 19:11:53.184775	2025-03-15 19:11:53.184775
abd311b7-57aa-4d4c-b71e-e9246d24c7da	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Polishing faucets	Polissage des robinets	Pulido de grifos	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
f6198d00-4f97-4b97-96ab-fab52db48071	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Cleaning tile grout	Nettoyage des joints de carrelage	Limpieza de la lechada de las baldosas	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
d2bd54b8-016d-4f4a-a143-0258a16bd1d7	7a206e7f-6ee6-4a28-b395-b6e24451b836	3	Cleaning soap dispensers	Distributeurs de savon de nettoyage	Dispensadores de jabón de limpieza	t	\N	2025-03-15 19:13:09.843838	2025-03-15 19:13:09.843838
05012097-f844-4ecf-b8b0-2fe265c66c66	bd28d28b-44d9-4927-9bf8-6b48bf58217e	3	Carpet shampooing	Shampoing pour tapis	Lavado de alfombras con champú	t	\N	2025-03-15 19:13:57.376066	2025-03-15 19:13:57.376066
d491f200-4b1c-4bc5-b0ce-4de9b8c78d22	bd28d28b-44d9-4927-9bf8-6b48bf58217e	3	Chandelier cleaning	Nettoyage de lustre	Limpieza de lámparas de araña	t	\N	2025-03-15 19:13:57.376066	2025-03-15 19:13:57.376066
4205c004-e873-427d-882b-0c6e66244aa9	10cb4619-2e98-40b7-84b7-a6609cc9e209	2	Structural Repairs	Réparations structurelles	Reparaciones estructurales	t	\N	2025-03-15 19:14:18.877021	2025-03-15 19:14:18.877021
2165bbe7-5be1-469c-b186-b15a524928e0	46e14359-d129-4444-9247-d36339f515d5	3	Repairing toilets	Réparation des toilettes	Reparación de inodoros	t	\N	2025-03-15 19:15:15.531196	2025-03-15 19:15:15.531196
a94b6475-2897-4193-a95e-9f1a17e888fe	46e14359-d129-4444-9247-d36339f515d5	3	Installing water heaters	Installation de chauffe-eau	Instalación de calentadores de agua	t	\N	2025-03-15 19:15:15.531196	2025-03-15 19:15:15.531196
7fb4ad6d-4bc1-47f7-86e1-ef7f71bbbaa9	8ed5bbed-4515-4d47-9406-878b00cbc239	3	Installing ceiling fans	Installation de ventilateurs de plafond	Instalación de ventiladores de techo	t	\N	2025-03-15 19:15:40.077105	2025-03-15 19:15:40.077105
f198c716-bd5f-4b73-946f-44ccac50586b	af113e03-ac2c-4be2-bef4-832ea1b3d599	3	Changing air filters	Changement des filtres à air	Cambio de filtros de aire	t	\N	2025-03-15 19:15:59.411226	2025-03-15 19:15:59.411226
51db1058-82ee-4419-8a4c-1e731627ed50	af113e03-ac2c-4be2-bef4-832ea1b3d599	3	Repairing heaters	Réparation de radiateurs	Reparación de calentadores	t	\N	2025-03-15 19:15:59.411226	2025-03-15 19:15:59.411226
fb73d482-4681-412a-814e-4d4e91fe36e3	4205c004-e873-427d-882b-0c6e66244aa9	3	Fixing squeaky floors	Réparer les planchers qui grincent	Arreglando pisos chirriantes	t	\N	2025-03-15 19:16:21.283601	2025-03-15 19:16:21.283601
413fc6cd-f64b-4335-8ddd-2da64e63f5f8	4205c004-e873-427d-882b-0c6e66244aa9	3	Replacing broken tiles	Remplacement des tuiles cassées	Reemplazo de baldosas rotas	t	\N	2025-03-15 19:16:21.283601	2025-03-15 19:16:21.283601
dbfc2174-206e-4304-af5b-6b5e97570582	d15b7952-0cb3-40ce-9585-214614486f4a	2	Energy Efficiency	Efficacité énergétique	Eficiencia energética	t	\N	2025-03-15 19:16:52.047188	2025-03-15 19:16:52.047188
10cb4619-2e98-40b7-84b7-a6609cc9e209	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Maintenance and Repair Services	Services d'entretien et de réparation	Servicios de mantenimiento y reparación	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
ca9d43e9-c499-4d0f-a631-1f22f03fd9f4	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Gardening and Outdoor Services	Services de jardinage et d'extérieur	Servicios de jardinería y exteriores	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
8f60dcfe-e3cd-4354-b978-cf06cd34613a	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Pet Care Services	Services de soins pour animaux de compagnie	Servicios de cuidado de mascotas	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
7c7f652e-e512-463e-80ae-43076db6b9ee	88949e1f-d5f4-4219-a04d-9f32088d60b2	1	Technology and Appliance Services	Services de technologie et d'appareils électroménagers	Servicios de tecnología y electrodomésticos	t	\N	2025-03-15 19:10:00.678563	2025-03-15 19:10:00.678563
7a206e7f-6ee6-4a28-b395-b6e24451b836	9699cb28-5301-41ce-8cca-093739d01ddb	2	Bathroom Cleaning	Nettoyage de salle de bain	Limpieza del baño	t	\N	2025-03-15 19:10:54.586227	2025-03-15 19:10:54.586227
bd28d28b-44d9-4927-9bf8-6b48bf58217e	9699cb28-5301-41ce-8cca-093739d01ddb	2	Specialized Cleaning	Nettoyage spécialisé	Limpieza especializada	t	\N	2025-03-15 19:10:54.586227	2025-03-15 19:10:54.586227
0edbf1e8-52e0-4f5f-b431-8399a05b68f9	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Dusting furniture	Dépoussiérer les meubles	Quitar el polvo de los muebles	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
c357f4aa-edc8-49f8-86d1-06c81da0b004	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Vacuuming carpets	Passer l'aspirateur sur les tapis	Aspirar alfombras	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
8d1bfad4-b0ce-42a9-86b1-f32f44d33289	71c33d81-9a87-46de-a596-edd215ab7a7e	3	Sweeping floors	Balayer les sols	Barrer pisos	t	\N	2025-03-15 19:11:28.710158	2025-03-15 19:11:28.710158
823c2b95-a75a-49cb-8c66-247de1e8e67f	a9f9970f-adf6-4abd-aa15-946139d5389f	3	Painting interior walls	Peindre les murs intérieurs	Pintar paredes interiores	t	\N	2025-03-15 19:17:10.375526	2025-03-15 19:17:10.375526
53d8e5d0-9d19-45e8-b8c3-24d389bdaf1d	a9f9970f-adf6-4abd-aa15-946139d5389f	3	Painting trim	Peinture des garnitures	Pintar molduras	t	\N	2025-03-15 19:17:10.375526	2025-03-15 19:17:10.375526
4793f745-c209-4867-99ec-e2cc4e3fb9dd	a9f9970f-adf6-4abd-aa15-946139d5389f	3	Exterior house painting	Peinture extérieure de la maison	Pintura exterior de casas	t	\N	2025-03-15 19:17:10.375526	2025-03-15 19:17:10.375526
8bf94931-f093-4d91-b2a3-969a2b04f9ac	a9f9970f-adf6-4abd-aa15-946139d5389f	3	Staining decks	Teinture des terrasses	Tinción de cubiertas	t	\N	2025-03-15 19:17:10.375526	2025-03-15 19:17:10.375526
a2b079cb-9d44-4fda-acb9-3f8561b6a1f3	a9f9970f-adf6-4abd-aa15-946139d5389f	3	Wallpaper installation	Pose de papier peint	Instalación de papel tapiz	t	\N	2025-03-15 19:17:10.375526	2025-03-15 19:17:10.375526
388240a2-9173-4735-a3ae-90df97f3c0d5	59967254-1c47-4f46-a8fc-a754777bd43a	3	Kitchen remodeling	Rénovation de cuisine	Remodelación de cocina	t	\N	2025-03-15 19:17:28.748956	2025-03-15 19:17:28.748956
9f316ed6-0e64-478c-a618-069a01e2857e	59967254-1c47-4f46-a8fc-a754777bd43a	3	Bathroom upgrades	Améliorations de la salle de bain	Mejoras en el baño	t	\N	2025-03-15 19:17:28.748956	2025-03-15 19:17:28.748956
4989c5db-2c65-4139-a78e-c2ca5f606a5b	59967254-1c47-4f46-a8fc-a754777bd43a	3	Adding shelving	Ajout d'étagères	Añadiendo estanterías	t	\N	2025-03-15 19:17:28.748956	2025-03-15 19:17:28.748956
b970c363-c5ee-4395-b42c-e4d0331d95fe	59967254-1c47-4f46-a8fc-a754777bd43a	3	Building a deck	Construire une terrasse	Construyendo una terraza	t	\N	2025-03-15 19:17:28.748956	2025-03-15 19:17:28.748956
93ee4117-04af-4c11-81ee-5a066271a8e5	bcdcaa91-8d3b-41a0-b48a-b09969f009c7	3	Hanging artwork	Œuvres d'art suspendues	Colgar obras de arte	t	\N	2025-03-15 19:17:48.309181	2025-03-15 19:17:48.309181
43285cf3-0464-4638-b6e6-36282a1cd53b	bcdcaa91-8d3b-41a0-b48a-b09969f009c7	3	Arranging furniture	Disposer les meubles	Arreglando los muebles	t	\N	2025-03-15 19:17:48.309181	2025-03-15 19:17:48.309181
64ef7676-aba9-4942-abe5-3d52fee39d41	bcdcaa91-8d3b-41a0-b48a-b09969f009c7	3	Placing rugs	Placer des tapis	Colocación de alfombras	t	\N	2025-03-15 19:17:48.309181	2025-03-15 19:17:48.309181
62b1c732-db7b-41f8-bdaa-5db7dacf369b	dbfc2174-206e-4304-af5b-6b5e97570582	3	Insulating walls	Isolation des murs	paredes aislantes	t	\N	2025-03-15 19:18:07.452849	2025-03-15 19:18:07.452849
e86b3a6c-5e77-4f96-82c0-59303d0b727a	dbfc2174-206e-4304-af5b-6b5e97570582	3	Sealing doors	Portes étanches	Sellado de puertas	t	\N	2025-03-15 19:18:07.452849	2025-03-15 19:18:07.452849
4b0b55c5-8218-4a47-b20c-731665cbd78f	dbfc2174-206e-4304-af5b-6b5e97570582	3	Upgrading windows	Mise à niveau des fenêtres	Actualización de ventanas	t	\N	2025-03-15 19:18:07.452849	2025-03-15 19:18:07.452849
79c688cc-d3ed-4105-9a6a-e9c5fb2a1091	dbfc2174-206e-4304-af5b-6b5e97570582	3	Adding weather stripping	Ajout de coupe-froid	Adición de burletes	t	\N	2025-03-15 19:18:07.452849	2025-03-15 19:18:07.452849
cdde867b-8bb2-4bb0-951c-5a9d15b3538e	59967254-1c47-4f46-a8fc-a754777bd43a	3	Installing new flooring	Installation d'un nouveau revêtement de sol	Instalación de pisos nuevos	t	\N	2025-03-15 19:17:28.748956	2025-03-15 19:17:28.748956
6a0a53b7-0cba-4685-ac13-f91a1a0e56f8	bcdcaa91-8d3b-41a0-b48a-b09969f009c7	3	Installing curtains	Installation de rideaux	Instalación de cortinas	t	\N	2025-03-15 19:17:48.309181	2025-03-15 19:17:48.309181
1ae01a49-422f-4a15-9e25-ab62de294ad6	bcdcaa91-8d3b-41a0-b48a-b09969f009c7	3	Setting up lighting	Mise en place de l'éclairage	Configuración de la iluminación	t	\N	2025-03-15 19:17:48.309181	2025-03-15 19:17:48.309181
1d2cd553-421c-44e4-a243-5cfc5da61304	dbfc2174-206e-4304-af5b-6b5e97570582	3	Installing solar panels	Installation de panneaux solaires	Instalación de paneles solares	t	\N	2025-03-15 19:18:07.452849	2025-03-15 19:18:07.452849
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (subscription_id, needer_id, plan_type, start_date, end_date, features, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tax_remittances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_remittances (remittance_id, tax_rule_id, total_amount, currency, period_start, period_end, remitted_at, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tax_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rules (tax_rule_id, jurisdiction_type, jurisdiction_code, sector_code, tax_name, tax_rate, applies_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: transaction_taxes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_taxes (transaction_tax_id, transaction_id, tax_rule_id, amount, taxable_amount, currency, collected_from, status, remitted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (transaction_id, booking_id, invoice_id, needer_id, helper_id, total_amount, commission_amount, helper_amount, service_fee, currency, helper_location_id, needer_location_id, status, payment_method, payment_details, needer_confirmed, helper_confirmed, created_at, updated_at, completed_at) FROM stdin;
\.


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.translations (translation_id, entity_type, entity_id, language, translated_text, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_contacts (contact_id, user_id, contact_type, contact_value, extension, label, is_verified, visibility, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_role_id, user_id, role, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, firstname, lastname, lastname2, dob, username, email, password_hash, preferred_language, profile_photo_url, subscription_id, company_id, primary_address_id, certification_status, last_certified_at, created_at, updated_at, gender, title) FROM stdin;
8c3a21f7-55bc-4aa8-9cc0-530819f82f5c	Ghislain	Simard		\N	dfgdfgdfg	dfgdfgdfg@uadioa.com	$2b$10$ImEKxb/E2UzGMgDaCrexpOggy6/HGQtVpspxJ5Y8kpUJPH3F2sJke	en	\N	\N	\N	\N	uncertified	\N	2025-03-21 02:26:17.116	2025-03-21 02:26:17.116	\N	\N
4b9bbe36-1c11-4177-a5db-9e0ea9cc5b30	Ghislin	jkjh	jhkjh	\N	hkjhkj	hkjhkj@skklj.com	$2b$10$nPiZ3dK1rsy.3lEveEVnEu5cSbnPfGmj2pZ89LJjw2bjAttkyyrjy	en	\N	\N	\N	\N	uncertified	\N	2025-03-21 02:30:19.905	2025-03-21 02:30:19.905	\N	\N
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification_tokens (token_id, user_id, token, type, expires_at, created_at) FROM stdin;
25b1e16e-9cf8-4209-b35e-01337da18ef5	8c3a21f7-55bc-4aa8-9cc0-530819f82f5c	be065b73f0389cf13d14fa943fd146bac3fb23ae20f31e8a691d79dac65c1f98	email_verified	2025-03-22 02:26:17.126	2025-03-21 02:26:17.127
bb0aa6d4-a279-4f22-81ba-01231db8ff67	4b9bbe36-1c11-4177-a5db-9e0ea9cc5b30	5607a56d60d69e0410a206be55a99b3a652b08854099d9753a7ec50a8bd20585	email_verified	2025-03-22 02:30:19.906	2025-03-21 02:30:19.907
\.


--
-- Name: Helpers Helpers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Helpers"
    ADD CONSTRAINT "Helpers_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- Name: admin_settings admin_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_settings
    ADD CONSTRAINT admin_settings_pkey PRIMARY KEY (setting_id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (campaign_id);


--
-- Name: certification_proofs certification_proofs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certification_proofs
    ADD CONSTRAINT certification_proofs_pkey PRIMARY KEY (proof_id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (company_id);


--
-- Name: content_moderation content_moderation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_moderation
    ADD CONSTRAINT content_moderation_pkey PRIMARY KEY (moderation_id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (contract_id);


--
-- Name: database_logs database_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.database_logs
    ADD CONSTRAINT database_logs_pkey PRIMARY KEY (log_id);


--
-- Name: exchange_rates exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_pkey PRIMARY KEY (exchange_rate_id);


--
-- Name: exports exports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exports
    ADD CONSTRAINT exports_pkey PRIMARY KEY (export_id);


--
-- Name: helper_certifications helper_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_certifications
    ADD CONSTRAINT helper_certifications_pkey PRIMARY KEY (certification_id);


--
-- Name: helper_services helper_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_services
    ADD CONSTRAINT helper_services_pkey PRIMARY KEY (helper_service_id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (invoice_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- Name: realtime_locations realtime_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realtime_locations
    ADD CONSTRAINT realtime_locations_pkey PRIMARY KEY (location_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: rfp_notifications rfp_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfp_notifications
    ADD CONSTRAINT rfp_notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: rfps rfps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfps
    ADD CONSTRAINT rfps_pkey PRIMARY KEY (rfp_id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: ghsimard
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (service_id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (subscription_id);


--
-- Name: tax_remittances tax_remittances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_remittances
    ADD CONSTRAINT tax_remittances_pkey PRIMARY KEY (remittance_id);


--
-- Name: tax_rules tax_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rules
    ADD CONSTRAINT tax_rules_pkey PRIMARY KEY (tax_rule_id);


--
-- Name: transaction_taxes transaction_taxes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_taxes
    ADD CONSTRAINT transaction_taxes_pkey PRIMARY KEY (transaction_tax_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (translation_id);


--
-- Name: user_contacts user_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_contacts
    ADD CONSTRAINT user_contacts_pkey PRIMARY KEY (contact_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (token_id);


--
-- Name: Helpers_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Helpers_email_key" ON public."Helpers" USING btree (email);


--
-- Name: idx_addresses_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_addresses_entity ON public.addresses USING btree (entity_type, entity_id);


--
-- Name: idx_admin_settings_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_settings_key ON public.admin_settings USING btree (key);


--
-- Name: idx_bookings_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_campaign_id ON public.bookings USING btree (campaign_id);


--
-- Name: idx_bookings_delivery_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_delivery_address_id ON public.bookings USING btree (delivery_address_id);


--
-- Name: idx_bookings_helper_service_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_helper_service_id ON public.bookings USING btree (helper_service_id);


--
-- Name: idx_bookings_needer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_needer_id ON public.bookings USING btree (needer_id);


--
-- Name: idx_campaigns_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaigns_entity ON public.campaigns USING btree (entity_type, entity_id);


--
-- Name: idx_campaigns_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaigns_user_id ON public.campaigns USING btree (user_id);


--
-- Name: idx_certification_proofs_certification_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_certification_proofs_certification_id ON public.certification_proofs USING btree (certification_id);


--
-- Name: idx_content_moderation_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_moderation_entity ON public.content_moderation USING btree (entity_type, entity_id);


--
-- Name: idx_content_moderation_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_moderation_user_id ON public.content_moderation USING btree (user_id);


--
-- Name: idx_contracts_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_booking_id ON public.contracts USING btree (booking_id);


--
-- Name: idx_contracts_helper_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_helper_id ON public.contracts USING btree (helper_id);


--
-- Name: idx_contracts_needer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_needer_id ON public.contracts USING btree (needer_id);


--
-- Name: idx_database_logs_details; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_database_logs_details ON public.database_logs USING gin (details);


--
-- Name: idx_database_logs_operation_details; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_database_logs_operation_details ON public.database_logs USING gin (operation_details);


--
-- Name: idx_database_logs_record_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_database_logs_record_id ON public.database_logs USING btree (record_id);


--
-- Name: idx_database_logs_table_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_database_logs_table_action ON public.database_logs USING btree (table_name, action);


--
-- Name: idx_database_logs_table_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_database_logs_table_timestamp ON public.database_logs USING btree (table_name, "timestamp");


--
-- Name: idx_database_logs_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_database_logs_timestamp ON public.database_logs USING btree ("timestamp");


--
-- Name: idx_database_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_database_logs_user_id ON public.database_logs USING btree (user_id);


--
-- Name: idx_exchange_rates_currency_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exchange_rates_currency_date ON public.exchange_rates USING btree (from_currency, to_currency, effective_date);


--
-- Name: idx_exports_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exports_entity ON public.exports USING btree (entity_type, entity_id);


--
-- Name: idx_exports_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exports_user_id ON public.exports USING btree (user_id);


--
-- Name: idx_helper_certifications_admin_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_helper_certifications_admin_id ON public.helper_certifications USING btree (admin_id);


--
-- Name: idx_helper_certifications_helper_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_helper_certifications_helper_id ON public.helper_certifications USING btree (helper_id);


--
-- Name: idx_helper_services_active_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_helper_services_active_campaign_id ON public.helper_services USING btree (active_campaign_id);


--
-- Name: idx_helper_services_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_helper_services_address_id ON public.helper_services USING btree (address_id);


--
-- Name: idx_helper_services_service_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_helper_services_service_id ON public.helper_services USING btree (service_id);


--
-- Name: idx_helper_services_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_helper_services_user_id ON public.helper_services USING btree (user_id);


--
-- Name: idx_invoices_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_booking_id ON public.invoices USING btree (booking_id);


--
-- Name: idx_invoices_helper_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_helper_id ON public.invoices USING btree (helper_id);


--
-- Name: idx_invoices_needer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_needer_id ON public.invoices USING btree (needer_id);


--
-- Name: idx_messages_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_booking_id ON public.messages USING btree (booking_id);


--
-- Name: idx_messages_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_receiver_id ON public.messages USING btree (receiver_id);


--
-- Name: idx_messages_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);


--
-- Name: idx_realtime_locations_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realtime_locations_campaign_id ON public.realtime_locations USING btree (campaign_id);


--
-- Name: idx_realtime_locations_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realtime_locations_timestamp ON public.realtime_locations USING btree ("timestamp");


--
-- Name: idx_realtime_locations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_realtime_locations_user_id ON public.realtime_locations USING btree (user_id);


--
-- Name: idx_reviews_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_booking_id ON public.reviews USING btree (booking_id);


--
-- Name: idx_rfp_notifications_helper_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfp_notifications_helper_id ON public.rfp_notifications USING btree (helper_id);


--
-- Name: idx_rfp_notifications_rfp_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfp_notifications_rfp_id ON public.rfp_notifications USING btree (rfp_id);


--
-- Name: idx_rfps_needer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfps_needer_id ON public.rfps USING btree (needer_id);


--
-- Name: idx_rfps_service_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfps_service_id ON public.rfps USING btree (service_id);


--
-- Name: idx_services_parent_service_id; Type: INDEX; Schema: public; Owner: ghsimard
--

CREATE INDEX idx_services_parent_service_id ON public.services USING btree (parent_service_id);


--
-- Name: idx_subscriptions_needer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_needer_id ON public.subscriptions USING btree (needer_id);


--
-- Name: idx_tax_remittances_tax_rule_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tax_remittances_tax_rule_id ON public.tax_remittances USING btree (tax_rule_id);


--
-- Name: idx_tax_rules_jurisdiction_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tax_rules_jurisdiction_code ON public.tax_rules USING btree (jurisdiction_code);


--
-- Name: idx_transaction_taxes_tax_rule_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transaction_taxes_tax_rule_id ON public.transaction_taxes USING btree (tax_rule_id);


--
-- Name: idx_transaction_taxes_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transaction_taxes_transaction_id ON public.transaction_taxes USING btree (transaction_id);


--
-- Name: idx_transactions_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_booking_id ON public.transactions USING btree (booking_id);


--
-- Name: idx_transactions_helper_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_helper_id ON public.transactions USING btree (helper_id);


--
-- Name: idx_transactions_helper_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_helper_location_id ON public.transactions USING btree (helper_location_id);


--
-- Name: idx_transactions_invoice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_invoice_id ON public.transactions USING btree (invoice_id);


--
-- Name: idx_transactions_needer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_needer_id ON public.transactions USING btree (needer_id);


--
-- Name: idx_transactions_needer_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_needer_location_id ON public.transactions USING btree (needer_location_id);


--
-- Name: idx_translations_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_translations_entity ON public.translations USING btree (entity_type, entity_id);


--
-- Name: idx_user_contacts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_contacts_user_id ON public.user_contacts USING btree (user_id);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_users_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_company_id ON public.users USING btree (company_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_primary_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_primary_address_id ON public.users USING btree (primary_address_id);


--
-- Name: idx_users_subscription_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_subscription_id ON public.users USING btree (subscription_id);


--
-- Name: idx_verification_tokens_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_verification_tokens_token ON public.verification_tokens USING btree (token);


--
-- Name: idx_verification_tokens_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_verification_tokens_user_id ON public.verification_tokens USING btree (user_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verification_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX verification_tokens_token_key ON public.verification_tokens USING btree (token);


--
-- Name: bookings bookings_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- Name: bookings bookings_delivery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_delivery_address_id_fkey FOREIGN KEY (delivery_address_id) REFERENCES public.addresses(address_id);


--
-- Name: bookings bookings_helper_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_helper_service_id_fkey FOREIGN KEY (helper_service_id) REFERENCES public.helper_services(helper_service_id);


--
-- Name: bookings bookings_needer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_needer_id_fkey FOREIGN KEY (needer_id) REFERENCES public.users(user_id);


--
-- Name: bookings bookings_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id);


--
-- Name: campaigns campaigns_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: certification_proofs certification_proofs_certification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certification_proofs
    ADD CONSTRAINT certification_proofs_certification_id_fkey FOREIGN KEY (certification_id) REFERENCES public.helper_certifications(certification_id);


--
-- Name: content_moderation content_moderation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_moderation
    ADD CONSTRAINT content_moderation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: contracts contracts_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- Name: contracts contracts_helper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES public.users(user_id);


--
-- Name: contracts contracts_needer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_needer_id_fkey FOREIGN KEY (needer_id) REFERENCES public.users(user_id);


--
-- Name: database_logs database_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.database_logs
    ADD CONSTRAINT database_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: exports exports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exports
    ADD CONSTRAINT exports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: helper_certifications helper_certifications_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_certifications
    ADD CONSTRAINT helper_certifications_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(user_id);


--
-- Name: helper_certifications helper_certifications_helper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_certifications
    ADD CONSTRAINT helper_certifications_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES public.users(user_id);


--
-- Name: helper_services helper_services_active_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_services
    ADD CONSTRAINT helper_services_active_campaign_id_fkey FOREIGN KEY (active_campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- Name: helper_services helper_services_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_services
    ADD CONSTRAINT helper_services_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(address_id);


--
-- Name: helper_services helper_services_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_services
    ADD CONSTRAINT helper_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);


--
-- Name: helper_services helper_services_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.helper_services
    ADD CONSTRAINT helper_services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: invoices invoices_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- Name: invoices invoices_helper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES public.users(user_id);


--
-- Name: invoices invoices_needer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_needer_id_fkey FOREIGN KEY (needer_id) REFERENCES public.users(user_id);


--
-- Name: messages messages_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(user_id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id);


--
-- Name: realtime_locations realtime_locations_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realtime_locations
    ADD CONSTRAINT realtime_locations_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- Name: realtime_locations realtime_locations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realtime_locations
    ADD CONSTRAINT realtime_locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- Name: rfp_notifications rfp_notifications_helper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfp_notifications
    ADD CONSTRAINT rfp_notifications_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES public.users(user_id);


--
-- Name: rfp_notifications rfp_notifications_rfp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfp_notifications
    ADD CONSTRAINT rfp_notifications_rfp_id_fkey FOREIGN KEY (rfp_id) REFERENCES public.rfps(rfp_id);


--
-- Name: rfps rfps_needer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfps
    ADD CONSTRAINT rfps_needer_id_fkey FOREIGN KEY (needer_id) REFERENCES public.users(user_id);


--
-- Name: rfps rfps_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfps
    ADD CONSTRAINT rfps_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(service_id);


--
-- Name: services services_parent_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ghsimard
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_parent_service_id_fkey FOREIGN KEY (parent_service_id) REFERENCES public.services(service_id);


--
-- Name: subscriptions subscriptions_needer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_needer_id_fkey FOREIGN KEY (needer_id) REFERENCES public.users(user_id);


--
-- Name: tax_remittances tax_remittances_tax_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_remittances
    ADD CONSTRAINT tax_remittances_tax_rule_id_fkey FOREIGN KEY (tax_rule_id) REFERENCES public.tax_rules(tax_rule_id);


--
-- Name: transaction_taxes transaction_taxes_tax_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_taxes
    ADD CONSTRAINT transaction_taxes_tax_rule_id_fkey FOREIGN KEY (tax_rule_id) REFERENCES public.tax_rules(tax_rule_id);


--
-- Name: transaction_taxes transaction_taxes_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_taxes
    ADD CONSTRAINT transaction_taxes_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(transaction_id);


--
-- Name: transactions transactions_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- Name: transactions transactions_helper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES public.users(user_id);


--
-- Name: transactions transactions_helper_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_helper_location_id_fkey FOREIGN KEY (helper_location_id) REFERENCES public.addresses(address_id);


--
-- Name: transactions transactions_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id);


--
-- Name: transactions transactions_needer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_needer_id_fkey FOREIGN KEY (needer_id) REFERENCES public.users(user_id);


--
-- Name: transactions transactions_needer_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_needer_location_id_fkey FOREIGN KEY (needer_location_id) REFERENCES public.addresses(address_id);


--
-- Name: user_contacts user_contacts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_contacts
    ADD CONSTRAINT user_contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users users_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- Name: users users_primary_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_primary_address_id_fkey FOREIGN KEY (primary_address_id) REFERENCES public.addresses(address_id);


--
-- Name: users users_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(subscription_id);


--
-- Name: verification_tokens verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

