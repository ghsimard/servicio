import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        login: 'Sign in',
        signUp: 'Sign up',
        clear: 'Clear',
        close: 'Close',
        profile: 'Profile',
        logout: 'Logout',
        testUI: 'Test UI',
        authTest: 'Auth Test',
        register: 'Register',
        verifyEmail: 'Verify Email',
        test: 'Test'
      },
      app: {
        title: 'Servicio',
        mainHeading: 'Find Your Help',
        subtitle: 'Discover and book the services you need, all in one place',
        mainContent: 'Main content area',
        searchSection: 'Search section'
      },
      search: {
        placeholder: 'Search services...',
        advancedSearch: 'Advanced Search',
        service: 'Service Type',
        location: 'Location',
        priceRange: 'Price Range',
        availability: 'Availability',
        search: 'Search',
        loading: 'Loading services...',
        error: 'Error loading services',
        resultsFound: '{{count}} services found',
        noResults: 'No services found',
        noHistory: 'No recent searches',
        minChars: 'Type at least 3 characters to search',
        serviceSelected: 'Selected service: {{name}}',
        mainSearch: 'Main search form',
        serviceInput: 'Enter service type',
        locationInput: 'Enter location',
        submit: 'Search for services',
        openAdvanced: 'Open advanced search',
        advancedSearchForm: 'Advanced search form',
        clearForm: 'Clear search form',
        performAdvancedSearch: 'Perform advanced search',
        advancedSearchCompleted: 'Advanced search completed',
        cleared: 'Search form cleared',
        label: 'Service search'
      },
      navigation: {
        main: 'Main navigation',
        actions: 'Navigation actions'
      },
      language: {
        changed: 'Language changed to {{language}}'
      },
      auth: {
        pageTitle: 'Authentication Test Page',
        register: {
          title: 'Register a New Account',
          description: 'Create a new account with your email. After registration, you\'ll need to verify your email address.',
          fullName: 'Full Name',
          email: 'Email',
          password: 'Password',
          passwordHelp: 'Password must be at least 8 characters long',
          buttonText: 'Register',
          success: 'Registration successful! Please verify your email with the token provided.'
        },
        login: {
          title: 'Login to Your Account',
          description: 'Please login with your email and password. You must verify your email address before logging in.',
          email: 'Email',
          password: 'Password',
          buttonText: 'Login',
          failed: 'Login failed'
        },
        verify: {
          title: 'Verify Your Email',
          description: 'Enter the verification token that was provided during registration to verify your email address. In a real application, this token would be sent to your email.',
          token: 'Verification Token',
          buttonText: 'Verify Email',
          success: 'Email verified successfully. You can now log in.',
          failed: 'Email verification failed'
        },
        protected: {
          title: 'Test Protected Endpoint',
          endpoint: 'Endpoint Path',
          buttonText: 'Test Protected Endpoint',
          noToken: 'No authentication token available. Please login first.',
          failed: 'Request to protected endpoint failed',
          connectionError: 'Failed to connect to the server'
        },
        status: {
          title: 'Authentication Status',
          userId: 'User ID',
          notLoggedIn: 'Not logged in',
          token: 'Token',
          noToken: 'No token'
        },
        apiResponse: 'API Response'
      }
    }
  },
  fr: {
    translation: {
      common: {
        cancel: 'Annuler',
        save: 'Enregistrer',
        edit: 'Modifier',
        delete: 'Supprimer',
        login: 'Connexion',
        signUp: 'Inscription',
        clear: 'Effacer',
        close: 'Fermer',
        profile: 'Profil',
        logout: 'Déconnexion',
        testUI: 'Test UI',
        authTest: 'Test Auth',
        register: 'S\'inscrire',
        verifyEmail: 'Vérifier Email',
        test: 'Tester'
      },
      app: {
        title: 'Servicio',
        mainHeading: 'Trouvez Votre Aide',
        subtitle: 'Découvrez et réservez les services dont vous avez besoin, tout en un seul endroit',
        mainContent: 'Zone de contenu principal',
        searchSection: 'Section de recherche'
      },
      search: {
        placeholder: 'Rechercher des services...',
        advancedSearch: 'Recherche Avancée',
        service: 'Type de Service',
        location: 'Emplacement',
        priceRange: 'Fourchette de Prix',
        availability: 'Disponibilité',
        search: 'Rechercher',
        loading: 'Chargement des services...',
        error: 'Erreur lors du chargement des services',
        resultsFound: '{{count}} services trouvés',
        noResults: 'Aucun service trouvé',
        noHistory: 'Aucune recherche récente',
        minChars: 'Tapez au moins 3 caractères pour rechercher',
        serviceSelected: 'Service sélectionné : {{name}}',
        mainSearch: 'Formulaire de recherche principal',
        serviceInput: 'Entrez le type de service',
        locationInput: 'Entrez l\'emplacement',
        submit: 'Rechercher des services',
        openAdvanced: 'Ouvrir la recherche avancée',
        advancedSearchForm: 'Formulaire de recherche avancée',
        clearForm: 'Effacer le formulaire de recherche',
        performAdvancedSearch: 'Effectuer une recherche avancée',
        advancedSearchCompleted: 'Recherche avancée terminée',
        cleared: 'Formulaire de recherche effacé',
        label: 'Recherche de services'
      },
      navigation: {
        main: 'Navigation principale',
        actions: 'Actions de navigation'
      },
      language: {
        changed: 'Langue changée en {{language}}'
      },
      auth: {
        pageTitle: 'Page de Test d\'Authentification',
        register: {
          title: 'Créer un Nouveau Compte',
          description: 'Créez un nouveau compte avec votre email. Après l\'inscription, vous devrez vérifier votre adresse email.',
          fullName: 'Nom Complet',
          email: 'Email',
          password: 'Mot de passe',
          passwordHelp: 'Le mot de passe doit comporter au moins 8 caractères',
          buttonText: 'S\'inscrire',
          success: 'Inscription réussie ! Veuillez vérifier votre email avec le jeton fourni.'
        },
        login: {
          title: 'Connexion à Votre Compte',
          description: 'Veuillez vous connecter avec votre email et mot de passe. Vous devez vérifier votre adresse email avant de vous connecter.',
          email: 'Email',
          password: 'Mot de passe',
          buttonText: 'Se connecter',
          failed: 'Échec de la connexion'
        },
        verify: {
          title: 'Vérifier Votre Email',
          description: 'Entrez le jeton de vérification qui vous a été fourni lors de l\'inscription pour vérifier votre adresse email. Dans une application réelle, ce jeton serait envoyé à votre email.',
          token: 'Jeton de Vérification',
          buttonText: 'Vérifier Email',
          success: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.',
          failed: 'Échec de la vérification de l\'email'
        },
        protected: {
          title: 'Tester un Point de Terminaison Protégé',
          endpoint: 'Chemin du Point de Terminaison',
          buttonText: 'Tester le Point de Terminaison Protégé',
          noToken: 'Aucun jeton d\'authentification disponible. Veuillez vous connecter d\'abord.',
          failed: 'Échec de la requête au point de terminaison protégé',
          connectionError: 'Échec de la connexion au serveur'
        },
        status: {
          title: 'Statut d\'Authentification',
          userId: 'ID Utilisateur',
          notLoggedIn: 'Non connecté',
          token: 'Jeton',
          noToken: 'Pas de jeton'
        },
        apiResponse: 'Réponse API'
      }
    }
  },
  es: {
    translation: {
      common: {
        cancel: 'Cancelar',
        save: 'Guardar',
        edit: 'Editar',
        delete: 'Eliminar',
        login: 'Acceder',
        signUp: 'Registrarse',
        clear: 'Limpiar',
        close: 'Cerrar',
        profile: 'Perfil',
        logout: 'Cerrar sesión',
        testUI: 'Probar UI',
        authTest: 'Probar Auth',
        register: 'Registrarse',
        verifyEmail: 'Verificar Email',
        test: 'Probar'
      },
      app: {
        title: 'Servicio',
        mainHeading: 'Encuentra Tu Ayuda',
        subtitle: 'Descubre y reserva los servicios que necesitas, todo en un solo lugar',
        mainContent: 'Área de contenido principal',
        searchSection: 'Sección de búsqueda'
      },
      search: {
        placeholder: 'Buscar servicios...',
        advancedSearch: 'Búsqueda Avanzada',
        service: 'Tipo de Servicio',
        location: 'Ubicación',
        priceRange: 'Rango de Precio',
        availability: 'Disponibilidad',
        search: 'Buscar',
        loading: 'Cargando servicios...',
        error: 'Error al cargar servicios',
        resultsFound: '{{count}} servicios encontrados',
        noResults: 'No se encontraron servicios',
        noHistory: 'No hay búsquedas recientes',
        minChars: 'Escriba al menos 3 caracteres para buscar',
        serviceSelected: 'Servicio seleccionado: {{name}}',
        mainSearch: 'Formulario de búsqueda principal',
        serviceInput: 'Ingrese tipo de servicio',
        locationInput: 'Ingrese ubicación',
        submit: 'Buscar servicios',
        openAdvanced: 'Abrir búsqueda avanzada',
        advancedSearchForm: 'Formulario de búsqueda avanzada',
        clearForm: 'Limpiar formulario de búsqueda',
        performAdvancedSearch: 'Realizar búsqueda avanzada',
        advancedSearchCompleted: 'Búsqueda avanzada completada',
        cleared: 'Formulario de búsqueda limpiado',
        label: 'Búsqueda de servicios'
      },
      navigation: {
        main: 'Navegación principal',
        actions: 'Acciones de navegación'
      },
      language: {
        changed: 'Idioma cambiado a {{language}}'
      },
      auth: {
        pageTitle: 'Página de Prueba de Autenticación',
        register: {
          title: 'Registrar una Nueva Cuenta',
          description: 'Cree una nueva cuenta con su correo electrónico. Después del registro, deberá verificar su dirección de correo electrónico.',
          fullName: 'Nombre Completo',
          email: 'Correo Electrónico',
          password: 'Contraseña',
          passwordHelp: 'La contraseña debe tener al menos 8 caracteres',
          buttonText: 'Registrarse',
          success: '¡Registro exitoso! Por favor verifique su correo electrónico con el token proporcionado.'
        },
        login: {
          title: 'Iniciar Sesión en su Cuenta',
          description: 'Por favor inicie sesión con su correo electrónico y contraseña. Debe verificar su dirección de correo electrónico antes de iniciar sesión.',
          email: 'Correo Electrónico',
          password: 'Contraseña',
          buttonText: 'Iniciar Sesión',
          failed: 'Error al iniciar sesión'
        },
        verify: {
          title: 'Verificar su Correo Electrónico',
          description: 'Ingrese el token de verificación que se proporcionó durante el registro para verificar su dirección de correo electrónico. En una aplicación real, este token se enviaría a su correo electrónico.',
          token: 'Token de Verificación',
          buttonText: 'Verificar Correo',
          success: 'Correo electrónico verificado con éxito. Ahora puede iniciar sesión.',
          failed: 'Error al verificar el correo electrónico'
        },
        protected: {
          title: 'Probar Punto Final Protegido',
          endpoint: 'Ruta del Punto Final',
          buttonText: 'Probar Punto Final Protegido',
          noToken: 'No hay token de autenticación disponible. Por favor inicie sesión primero.',
          failed: 'Error en la solicitud al punto final protegido',
          connectionError: 'Error al conectarse al servidor'
        },
        status: {
          title: 'Estado de Autenticación',
          userId: 'ID de Usuario',
          notLoggedIn: 'No ha iniciado sesión',
          token: 'Token',
          noToken: 'Sin token'
        },
        apiResponse: 'Respuesta de la API'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;