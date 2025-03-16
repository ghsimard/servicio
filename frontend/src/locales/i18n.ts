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
        login: 'Log in',
        clear: 'Clear',
        close: 'Close'
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
        minChars: 'Type at least 2 characters to search',
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
        login: 'Se connecter',
        clear: 'Effacer',
        close: 'Fermer'
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
        minChars: 'Tapez au moins 2 caractères pour rechercher',
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
        login: 'Iniciar Sesión',
        clear: 'Limpiar',
        close: 'Cerrar'
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
        minChars: 'Escriba al menos 2 caracteres para buscar',
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