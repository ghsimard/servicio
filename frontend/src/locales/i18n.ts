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
        login: 'Login'
      },
      app: {
        title: 'Servicio',
        mainHeading: 'Find Your Helper',
        subtitle: 'Discover and book the Helper you need, all in one place'
      },
      search: {
        placeholder: 'Search for services...',
        advancedSearch: 'Advanced Search',
        service: 'Service Type',
        location: 'Location',
        priceRange: 'Price Range',
        availability: 'Availability',
        search: 'Search'
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
        login: 'Connexion'
      },
      app: {
        title: 'Servicio',
        mainHeading: 'Trouvez Votre Aide',
        subtitle: 'Découvrez et réservez les services dont vous avez besoin, le tout au même endroit'
      },
      search: {
        placeholder: 'Rechercher des services...',
        advancedSearch: 'Recherche Avancée',
        service: 'Type de Service',
        location: 'Emplacement',
        priceRange: 'Fourchette de Prix',
        availability: 'Disponibilité',
        search: 'Rechercher'
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
        login: 'Iniciar Sesión'
      },
      app: {
        title: 'Servicio',
        mainHeading: 'Encuentra Tu Ayuda',
        subtitle: 'Descubre y reserva los servicios que necesitas, todo en un solo lugar'
      },
      search: {
        placeholder: 'Buscar servicios...',
        advancedSearch: 'Búsqueda Avanzada',
        service: 'Tipo de Servicio',
        location: 'Ubicación',
        priceRange: 'Rango de Precio',
        availability: 'Disponibilidad',
        search: 'Buscar'
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