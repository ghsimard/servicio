import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogging } from '../contexts/LoggingContext';

/**
 * Custom hook to track form submissions
 * @param formName Name of the form for tracking purposes
 * @param additionalData Optional additional data to include with the tracking event
 * @returns Form tracking handlers
 */
export const useFormTracking = (
  formName: string,
  additionalData?: Record<string, unknown>
) => {
  const { trackUserAction } = useLogging();
  const location = useLocation();

  /**
   * Track a form submission
   * @param isValid Whether the form submission was valid
   * @param formData Optional data about the form submission (avoid sensitive info)
   */
  const trackFormSubmission = useCallback(
    (isValid: boolean, formData?: Record<string, unknown>) => {
      trackUserAction(location.pathname, 'form_submission', {
        formName,
        isValid,
        ...additionalData,
        ...(formData ? { formData } : {})
      });
    },
    [trackUserAction, location.pathname, formName, additionalData]
  );

  /**
   * Track form field interactions
   * @param fieldName Name of the field
   * @param interactionType Type of interaction (e.g., 'focus', 'blur', 'change')
   * @param fieldValue Optional value of the field (avoid sensitive info)
   */
  const trackFieldInteraction = useCallback(
    (
      fieldName: string,
      interactionType: 'focus' | 'blur' | 'change',
      fieldValue?: string | boolean | number
    ) => {
      // For change events, don't log the actual value for privacy reasons
      // unless it's explicitly a non-sensitive field
      const hasValue = fieldValue !== undefined;
      
      trackUserAction(location.pathname, 'form_field_interaction', {
        formName,
        fieldName,
        interactionType,
        ...(hasValue && interactionType !== 'change'
          ? { fieldValue }
          : { hasValue }),
        ...additionalData
      });
    },
    [trackUserAction, location.pathname, formName, additionalData]
  );

  /**
   * Track form validation errors
   * @param errors Map of field names to error messages
   */
  const trackFormErrors = useCallback(
    (errors: Record<string, string>) => {
      const errorFields = Object.keys(errors);
      
      if (errorFields.length > 0) {
        trackUserAction(location.pathname, 'form_validation_error', {
          formName,
          errorCount: errorFields.length,
          errorFields,
          ...additionalData
        });
      }
    },
    [trackUserAction, location.pathname, formName, additionalData]
  );

  return {
    trackFormSubmission,
    trackFieldInteraction,
    trackFormErrors
  };
};

export default useFormTracking; 