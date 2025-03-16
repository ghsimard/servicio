-- CreateEnum
CREATE TYPE "action_type" AS ENUM ('insert', 'update', 'delete');

-- CreateEnum
CREATE TYPE "applies_to_type" AS ENUM ('service_price', 'platform_commission', 'service_fee', 'all');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('pending', 'confirmed', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "campaign_status" AS ENUM ('active', 'expired', 'pending_payment');

-- CreateEnum
CREATE TYPE "campaign_type" AS ENUM ('promotion', 'certification_marker', 'priority_bump', 'motivated_helper', 'highlighted', 'expanded_market', 'extra_services', 'realtime_location', 'queue_system');

-- CreateEnum
CREATE TYPE "cert_status" AS ENUM ('pending', 'approved', 'rejected', 'revoked');

-- CreateEnum
CREATE TYPE "certification_status_type" AS ENUM ('uncertified', 'certified', 'revoked');

-- CreateEnum
CREATE TYPE "contact_type" AS ENUM ('fax', 'mobile', 'iphone', 'home', 'work', 'other_phone', 'custom_phone', 'email_personal', 'email_work', 'email_other', 'facebook', 'linkedin', 'twitter', 'instagram', 'custom_social');

-- CreateEnum
CREATE TYPE "contract_status" AS ENUM ('draft', 'sent', 'signed', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "contract_type" AS ENUM ('service', 'subscription', 'custom');

-- CreateEnum
CREATE TYPE "entity_type" AS ENUM ('user', 'helper_service', 'booking', 'rfp');

-- CreateEnum
CREATE TYPE "enum_users_role" AS ENUM ('USER', 'HELPER', 'ADMIN', 'user', 'admin');

-- CreateEnum
CREATE TYPE "file_type" AS ENUM ('pdf', 'docx', 'csv');

-- CreateEnum
CREATE TYPE "invoice_status" AS ENUM ('draft', 'sent', 'paid', 'overdue', 'canceled');

-- CreateEnum
CREATE TYPE "jurisdiction_type" AS ENUM ('municipal', 'provincial', 'federal', 'sector_specific');

-- CreateEnum
CREATE TYPE "location_type" AS ENUM ('international', 'country', 'state', 'city', 'neighborhood');

-- CreateEnum
CREATE TYPE "log_action" AS ENUM ('insert', 'update', 'delete');

-- CreateEnum
CREATE TYPE "moderation_entity_type" AS ENUM ('account_photo', 'listing_photo', 'certification_proof', 'rfp', 'review', 'message', 'portfolio_photo', 'gallery_photo');

-- CreateEnum
CREATE TYPE "moderation_status" AS ENUM ('approved', 'rejected', 'pending');

-- CreateEnum
CREATE TYPE "moderation_type" AS ENUM ('image', 'text');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('booking_request', 'booking_confirmation', 'booking_cancellation', 'message_received', 'payment_received', 'review_received', 'system_notification');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('credit_card', 'bank_transfer', 'crypto', 'paypal');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'paid', 'free');

-- CreateEnum
CREATE TYPE "plan_type" AS ENUM ('free', 'premium', 'enterprise');

-- CreateEnum
CREATE TYPE "proof_file_type" AS ENUM ('image', 'pdf', 'other');

-- CreateEnum
CREATE TYPE "remittance_status" AS ENUM ('pending', 'remitted');

-- CreateEnum
CREATE TYPE "rfp_status" AS ENUM ('active', 'expired', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('needer', 'helper', 'admin');

-- CreateEnum
CREATE TYPE "tax_status" AS ENUM ('pending', 'collected', 'remitted');

-- CreateEnum
CREATE TYPE "transaction_status" AS ENUM ('pending', 'held', 'completed', 'disputed', 'canceled');

-- CreateEnum
CREATE TYPE "translation_entity_type" AS ENUM ('service', 'company', 'ui_element', 'field_label', 'tooltip', 'title', 'dropdown_value', 'button', 'calendar');

-- CreateEnum
CREATE TYPE "user_role_type" AS ENUM ('needer', 'helper', 'admin');

-- CreateTable
CREATE TABLE "Helpers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "businessName" VARCHAR(255),
    "services" JSONB NOT NULL DEFAULT '[]',
    "yearsOfExperience" INTEGER,
    "age" INTEGER,
    "languages" JSONB NOT NULL DEFAULT '[]',
    "rating" DOUBLE PRECISION,
    "gender" VARCHAR(255),
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Helpers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "service_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "parent_service_id" UUID,
    "level" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "address_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_type" "entity_type" NOT NULL,
    "entity_id" UUID NOT NULL,
    "street" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "is_primary" BOOLEAN DEFAULT false,
    "visibility" JSONB DEFAULT '{"public": false}',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "admin_settings" (
    "setting_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR(100) NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("setting_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "needer_id" UUID NOT NULL,
    "helper_service_id" UUID NOT NULL,
    "delivery_address_id" UUID,
    "queue_position" INTEGER,
    "campaign_id" UUID,
    "start_time" TIMESTAMP(6),
    "end_time" TIMESTAMP(6),
    "status" "booking_status" DEFAULT 'pending',
    "commission" DECIMAL(10,2),
    "transaction_id" UUID,
    "needer_confirmed" BOOLEAN DEFAULT false,
    "helper_confirmed" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "campaign_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "campaign_type" "campaign_type" NOT NULL,
    "entity_type" "entity_type" NOT NULL,
    "entity_id" UUID NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "status" "campaign_status" DEFAULT 'pending_payment',
    "details" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("campaign_id")
);

-- CreateTable
CREATE TABLE "certification_proofs" (
    "proof_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "certification_id" UUID NOT NULL,
    "file_type" "proof_file_type" NOT NULL,
    "file_url" VARCHAR(255) NOT NULL,
    "file_name" VARCHAR(100),
    "uploaded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certification_proofs_pkey" PRIMARY KEY ("proof_id")
);

-- CreateTable
CREATE TABLE "companies" (
    "company_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "content_moderation" (
    "moderation_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "content_type" "moderation_type" NOT NULL,
    "entity_type" "moderation_entity_type" NOT NULL,
    "entity_id" UUID NOT NULL,
    "content_value" TEXT,
    "ia_score" DECIMAL(3,2),
    "ia_status" "moderation_status" DEFAULT 'pending',
    "admin_status" "moderation_status" DEFAULT 'pending',
    "moderation_comments" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_moderation_pkey" PRIMARY KEY ("moderation_id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "contract_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "needer_id" UUID NOT NULL,
    "helper_id" UUID NOT NULL,
    "contract_type" "contract_type" NOT NULL,
    "status" "contract_status" DEFAULT 'draft',
    "contract_url" VARCHAR(255),
    "signed_at" TIMESTAMP(6),
    "expires_at" TIMESTAMP(6),
    "terms" TEXT,
    "signature_needer" JSONB,
    "signature_helper" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "database_logs" (
    "log_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "table_name" VARCHAR(50) NOT NULL,
    "action" "action_type" NOT NULL,
    "record_id" UUID NOT NULL,
    "details" JSONB,
    "operation_details" JSONB,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "database_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "exchange_rate_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "from_currency" VARCHAR(10) NOT NULL,
    "to_currency" VARCHAR(10) NOT NULL,
    "rate" DECIMAL(15,6) NOT NULL,
    "effective_date" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("exchange_rate_id")
);

-- CreateTable
CREATE TABLE "exports" (
    "export_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "entity_type" "entity_type" NOT NULL,
    "entity_id" UUID NOT NULL,
    "file_type" "file_type" DEFAULT 'pdf',
    "file_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "downloaded" BOOLEAN DEFAULT false,

    CONSTRAINT "exports_pkey" PRIMARY KEY ("export_id")
);

-- CreateTable
CREATE TABLE "helper_certifications" (
    "certification_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "helper_id" UUID NOT NULL,
    "admin_id" UUID,
    "status" "cert_status" DEFAULT 'pending',
    "evaluation_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "evaluation_comments" TEXT,
    "proof_required" BOOLEAN DEFAULT true,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "is_visible" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "helper_certifications_pkey" PRIMARY KEY ("certification_id")
);

-- CreateTable
CREATE TABLE "helper_services" (
    "helper_service_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "address_id" UUID,
    "active_campaign_id" UUID,
    "price" DECIMAL(10,2),
    "availability" JSONB,
    "location_type" "location_type",
    "location_details" JSONB,
    "listing_photo_url" VARCHAR(255),
    "gallery_id" VARCHAR(24),
    "visibility" JSONB DEFAULT '{"photo": true, "price": true, "address": true, "contacts": true, "location": true, "availability": true}',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "helper_services_pkey" PRIMARY KEY ("helper_service_id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "invoice_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "needer_id" UUID NOT NULL,
    "helper_id" UUID NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "commission_amount" DECIMAL(10,2) NOT NULL,
    "helper_amount" DECIMAL(10,2) NOT NULL,
    "service_fee" DECIMAL(10,2),
    "total_taxes" DECIMAL(10,2) DEFAULT 0.00,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'EUR',
    "status" "invoice_status" DEFAULT 'draft',
    "issued_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(6),
    "paid_at" TIMESTAMP(6),
    "invoice_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "booking_id" UUID,
    "content" TEXT,
    "sent_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "realtime_locations" (
    "location_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" UUID,

    CONSTRAINT "realtime_locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "rfp_notifications" (
    "notification_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rfp_id" UUID NOT NULL,
    "helper_id" UUID NOT NULL,
    "sent_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfp_notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "rfps" (
    "rfp_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "needer_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "service_id" UUID NOT NULL,
    "details" TEXT,
    "expiration_date" TIMESTAMP(6),
    "status" "rfp_status" DEFAULT 'active',
    "payment_status" "payment_status" DEFAULT 'free',
    "price" DECIMAL(10,2) DEFAULT 0.00,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfps_pkey" PRIMARY KEY ("rfp_id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "subscription_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "needer_id" UUID NOT NULL,
    "plan_type" "plan_type" NOT NULL,
    "start_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(6),
    "features" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateTable
CREATE TABLE "tax_remittances" (
    "remittance_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tax_rule_id" UUID NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'EUR',
    "period_start" TIMESTAMP(6) NOT NULL,
    "period_end" TIMESTAMP(6) NOT NULL,
    "remitted_at" TIMESTAMP(6),
    "status" "remittance_status" DEFAULT 'pending',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_remittances_pkey" PRIMARY KEY ("remittance_id")
);

-- CreateTable
CREATE TABLE "tax_rules" (
    "tax_rule_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "jurisdiction_type" "jurisdiction_type" NOT NULL,
    "jurisdiction_code" VARCHAR(50) NOT NULL,
    "sector_code" VARCHAR(50),
    "tax_name" VARCHAR(100) NOT NULL,
    "tax_rate" DECIMAL(5,2) NOT NULL,
    "applies_to" "applies_to_type" NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tax_rules_pkey" PRIMARY KEY ("tax_rule_id")
);

-- CreateTable
CREATE TABLE "transaction_taxes" (
    "transaction_tax_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "transaction_id" UUID NOT NULL,
    "tax_rule_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "taxable_amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'EUR',
    "collected_from" VARCHAR(10) NOT NULL,
    "status" "tax_status" DEFAULT 'pending',
    "remitted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_taxes_pkey" PRIMARY KEY ("transaction_tax_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "invoice_id" UUID,
    "needer_id" UUID NOT NULL,
    "helper_id" UUID NOT NULL,
    "total_amount" DECIMAL(10,2),
    "commission_amount" DECIMAL(10,2),
    "helper_amount" DECIMAL(10,2),
    "service_fee" DECIMAL(10,2),
    "currency" VARCHAR(10) NOT NULL DEFAULT 'EUR',
    "helper_location_id" UUID,
    "needer_location_id" UUID,
    "status" "transaction_status" DEFAULT 'pending',
    "payment_method" "payment_method",
    "payment_details" JSONB,
    "needer_confirmed" BOOLEAN DEFAULT false,
    "helper_confirmed" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(6),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "translations" (
    "translation_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_type" "translation_entity_type" NOT NULL,
    "entity_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "translated_text" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("translation_id")
);

-- CreateTable
CREATE TABLE "user_contacts" (
    "contact_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "contact_type" "contact_type" NOT NULL,
    "contact_value" VARCHAR(255) NOT NULL,
    "extension" VARCHAR(20),
    "label" VARCHAR(50),
    "is_verified" BOOLEAN DEFAULT false,
    "visibility" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_contacts_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role" "role_type" NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "preferred_language" VARCHAR(10) DEFAULT 'en',
    "profile_photo_url" VARCHAR(255),
    "subscription_id" UUID,
    "company_id" UUID,
    "primary_address_id" UUID,
    "certification_status" "certification_status_type" DEFAULT 'uncertified',
    "last_certified_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Helpers_email_key" ON "Helpers"("email");

-- CreateIndex
CREATE INDEX "idx_services_parent_service_id" ON "services"("parent_service_id");

-- CreateIndex
CREATE INDEX "idx_addresses_entity" ON "addresses"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_admin_settings_key" ON "admin_settings"("key");

-- CreateIndex
CREATE INDEX "idx_bookings_campaign_id" ON "bookings"("campaign_id");

-- CreateIndex
CREATE INDEX "idx_bookings_delivery_address_id" ON "bookings"("delivery_address_id");

-- CreateIndex
CREATE INDEX "idx_bookings_helper_service_id" ON "bookings"("helper_service_id");

-- CreateIndex
CREATE INDEX "idx_bookings_needer_id" ON "bookings"("needer_id");

-- CreateIndex
CREATE INDEX "idx_campaigns_entity" ON "campaigns"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_campaigns_user_id" ON "campaigns"("user_id");

-- CreateIndex
CREATE INDEX "idx_certification_proofs_certification_id" ON "certification_proofs"("certification_id");

-- CreateIndex
CREATE INDEX "idx_content_moderation_entity" ON "content_moderation"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_content_moderation_user_id" ON "content_moderation"("user_id");

-- CreateIndex
CREATE INDEX "idx_contracts_booking_id" ON "contracts"("booking_id");

-- CreateIndex
CREATE INDEX "idx_contracts_helper_id" ON "contracts"("helper_id");

-- CreateIndex
CREATE INDEX "idx_contracts_needer_id" ON "contracts"("needer_id");

-- CreateIndex
CREATE INDEX "idx_database_logs_details" ON "database_logs" USING GIN ("details");

-- CreateIndex
CREATE INDEX "idx_database_logs_operation_details" ON "database_logs" USING GIN ("operation_details");

-- CreateIndex
CREATE INDEX "idx_database_logs_record_id" ON "database_logs"("record_id");

-- CreateIndex
CREATE INDEX "idx_database_logs_table_action" ON "database_logs"("table_name", "action");

-- CreateIndex
CREATE INDEX "idx_database_logs_table_timestamp" ON "database_logs"("table_name", "timestamp");

-- CreateIndex
CREATE INDEX "idx_database_logs_timestamp" ON "database_logs"("timestamp");

-- CreateIndex
CREATE INDEX "idx_database_logs_user_id" ON "database_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_exchange_rates_currency_date" ON "exchange_rates"("from_currency", "to_currency", "effective_date");

-- CreateIndex
CREATE INDEX "idx_exports_entity" ON "exports"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_exports_user_id" ON "exports"("user_id");

-- CreateIndex
CREATE INDEX "idx_helper_certifications_admin_id" ON "helper_certifications"("admin_id");

-- CreateIndex
CREATE INDEX "idx_helper_certifications_helper_id" ON "helper_certifications"("helper_id");

-- CreateIndex
CREATE INDEX "idx_helper_services_active_campaign_id" ON "helper_services"("active_campaign_id");

-- CreateIndex
CREATE INDEX "idx_helper_services_address_id" ON "helper_services"("address_id");

-- CreateIndex
CREATE INDEX "idx_helper_services_service_id" ON "helper_services"("service_id");

-- CreateIndex
CREATE INDEX "idx_helper_services_user_id" ON "helper_services"("user_id");

-- CreateIndex
CREATE INDEX "idx_invoices_booking_id" ON "invoices"("booking_id");

-- CreateIndex
CREATE INDEX "idx_invoices_helper_id" ON "invoices"("helper_id");

-- CreateIndex
CREATE INDEX "idx_invoices_needer_id" ON "invoices"("needer_id");

-- CreateIndex
CREATE INDEX "idx_messages_booking_id" ON "messages"("booking_id");

-- CreateIndex
CREATE INDEX "idx_messages_receiver_id" ON "messages"("receiver_id");

-- CreateIndex
CREATE INDEX "idx_messages_sender_id" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "idx_realtime_locations_campaign_id" ON "realtime_locations"("campaign_id");

-- CreateIndex
CREATE INDEX "idx_realtime_locations_timestamp" ON "realtime_locations"("timestamp");

-- CreateIndex
CREATE INDEX "idx_realtime_locations_user_id" ON "realtime_locations"("user_id");

-- CreateIndex
CREATE INDEX "idx_reviews_booking_id" ON "reviews"("booking_id");

-- CreateIndex
CREATE INDEX "idx_rfp_notifications_helper_id" ON "rfp_notifications"("helper_id");

-- CreateIndex
CREATE INDEX "idx_rfp_notifications_rfp_id" ON "rfp_notifications"("rfp_id");

-- CreateIndex
CREATE INDEX "idx_rfps_needer_id" ON "rfps"("needer_id");

-- CreateIndex
CREATE INDEX "idx_rfps_service_id" ON "rfps"("service_id");

-- CreateIndex
CREATE INDEX "idx_subscriptions_needer_id" ON "subscriptions"("needer_id");

-- CreateIndex
CREATE INDEX "idx_tax_remittances_tax_rule_id" ON "tax_remittances"("tax_rule_id");

-- CreateIndex
CREATE INDEX "idx_tax_rules_jurisdiction_code" ON "tax_rules"("jurisdiction_code");

-- CreateIndex
CREATE INDEX "idx_transaction_taxes_tax_rule_id" ON "transaction_taxes"("tax_rule_id");

-- CreateIndex
CREATE INDEX "idx_transaction_taxes_transaction_id" ON "transaction_taxes"("transaction_id");

-- CreateIndex
CREATE INDEX "idx_transactions_booking_id" ON "transactions"("booking_id");

-- CreateIndex
CREATE INDEX "idx_transactions_helper_id" ON "transactions"("helper_id");

-- CreateIndex
CREATE INDEX "idx_transactions_helper_location_id" ON "transactions"("helper_location_id");

-- CreateIndex
CREATE INDEX "idx_transactions_invoice_id" ON "transactions"("invoice_id");

-- CreateIndex
CREATE INDEX "idx_transactions_needer_id" ON "transactions"("needer_id");

-- CreateIndex
CREATE INDEX "idx_transactions_needer_location_id" ON "transactions"("needer_location_id");

-- CreateIndex
CREATE INDEX "idx_translations_entity" ON "translations"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_user_contacts_user_id" ON "user_contacts"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_roles_user_id" ON "user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_company_id" ON "users"("company_id");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_primary_address_id" ON "users"("primary_address_id");

-- CreateIndex
CREATE INDEX "idx_users_subscription_id" ON "users"("subscription_id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_parent_service_id_fkey" FOREIGN KEY ("parent_service_id") REFERENCES "services"("service_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_helper_service_id_fkey" FOREIGN KEY ("helper_service_id") REFERENCES "helper_services"("helper_service_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_needer_id_fkey" FOREIGN KEY ("needer_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "certification_proofs" ADD CONSTRAINT "certification_proofs_certification_id_fkey" FOREIGN KEY ("certification_id") REFERENCES "helper_certifications"("certification_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_moderation" ADD CONSTRAINT "content_moderation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_needer_id_fkey" FOREIGN KEY ("needer_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "database_logs" ADD CONSTRAINT "database_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exports" ADD CONSTRAINT "exports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_certifications" ADD CONSTRAINT "helper_certifications_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_certifications" ADD CONSTRAINT "helper_certifications_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_services" ADD CONSTRAINT "helper_services_active_campaign_id_fkey" FOREIGN KEY ("active_campaign_id") REFERENCES "campaigns"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_services" ADD CONSTRAINT "helper_services_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_services" ADD CONSTRAINT "helper_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "helper_services" ADD CONSTRAINT "helper_services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_needer_id_fkey" FOREIGN KEY ("needer_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "realtime_locations" ADD CONSTRAINT "realtime_locations_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("campaign_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "realtime_locations" ADD CONSTRAINT "realtime_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rfp_notifications" ADD CONSTRAINT "rfp_notifications_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rfp_notifications" ADD CONSTRAINT "rfp_notifications_rfp_id_fkey" FOREIGN KEY ("rfp_id") REFERENCES "rfps"("rfp_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rfps" ADD CONSTRAINT "rfps_needer_id_fkey" FOREIGN KEY ("needer_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rfps" ADD CONSTRAINT "rfps_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_needer_id_fkey" FOREIGN KEY ("needer_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tax_remittances" ADD CONSTRAINT "tax_remittances_tax_rule_id_fkey" FOREIGN KEY ("tax_rule_id") REFERENCES "tax_rules"("tax_rule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction_taxes" ADD CONSTRAINT "transaction_taxes_tax_rule_id_fkey" FOREIGN KEY ("tax_rule_id") REFERENCES "tax_rules"("tax_rule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction_taxes" ADD CONSTRAINT "transaction_taxes_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_helper_location_id_fkey" FOREIGN KEY ("helper_location_id") REFERENCES "addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("invoice_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_needer_id_fkey" FOREIGN KEY ("needer_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_needer_location_id_fkey" FOREIGN KEY ("needer_location_id") REFERENCES "addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_contacts" ADD CONSTRAINT "user_contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_primary_address_id_fkey" FOREIGN KEY ("primary_address_id") REFERENCES "addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("subscription_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
