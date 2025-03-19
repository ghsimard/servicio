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

SET default_tablespace = '';

SET default_table_access_method = heap;

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
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now()
);


ALTER TABLE public.services OWNER TO ghsimard;

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
-- Name: services services_new_pkey; Type: CONSTRAINT; Schema: public; Owner: ghsimard
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_new_pkey PRIMARY KEY (service_id);


--
-- Name: idx_services_parent_service_id; Type: INDEX; Schema: public; Owner: ghsimard
--

CREATE INDEX idx_services_parent_service_id ON public.services USING btree (parent_service_id);


--
-- Name: services services_parent_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ghsimard
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_parent_service_id_fkey FOREIGN KEY (parent_service_id) REFERENCES public.services(service_id);


--
-- PostgreSQL database dump complete
--

