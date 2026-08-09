export const MUTATION_ERROR_MESSAGES = {
  INTERNAL_ERROR:
    "Ocurrió un error inesperado en el servidor. Inténtalo de nuevo más tarde.",
  VALIDATION_ERROR:
    "Los datos enviados no son válidos. Revisa la información e inténtalo de nuevo.",
  RATE_LIMIT_EXCEEDED:
    "Has realizado demasiadas solicitudes. Espera un momento e inténtalo de nuevo.",
  USER_NOTFOUND: "El usuario no existe o fue eliminado.",
  INVALID_CREDENTIALS:
    "Usuario o contraseña incorrecta.",
  TOKEN_REQUIRED: "Tu sesión ha expirado. Inicia sesión de nuevo.",
  INVALID_TOKEN: "Tu sesión ha expirado. Inicia sesión de nuevo.",
  REFRESH_TOKEN_REQUIRED: "Tu sesión ha expirado. Inicia sesión de nuevo.",
  INVALID_REFRESH_TOKEN: "Tu sesión ha expirado. Inicia sesión de nuevo.",
  EMAIL_ALREADY_REGISTERED:
    "El correo electrónico ya está registrado. Inicia sesión o usa otro correo.",
  CODE_INVALID_OR_EXPIRED:
    "El código es inválido o ha expirado. Solicita uno nuevo.",
  CODE_INVALID: "El código es incorrecto. Verifícalo e inténtalo de nuevo.",
  CODE_TOO_MANY_ATTEMPTS:
    "Has superado el límite de intentos. Solicita un nuevo código.",
  MAGIC_TOKEN_INVALID_OR_EXPIRED:
    "El enlace de acceso es inválido o ha expirado. Solicita uno nuevo.",
  NO_FIELDS_TO_UPDATE:
    "Debes modificar al menos un campo para guardar los cambios.",
  IMAGE_REQUIRED: "Debes seleccionar una imagen para continuar.",
  INVALID_IMAGE_FORMAT:
    "El formato de la imagen no es válido. Usa JPG, PNG, WEBP o GIF.",
  IMAGE_TOO_LARGE:
    "La imagen supera el tamaño máximo permitido (5MB). Elige una más pequeña.",
  INVALID_ID: "El identificador proporcionado no es válido.",
  INVALID_CATEGORY_TYPE: "El tipo de categoría debe ser ingreso o gasto.",
  CATEGORY_NAME_REQUIRED: "Debes escribir un nombre para la categoría.",
  CATEGORY_NOTFOUND: "La categoría no existe o fue eliminada.",
  CATEGORY_NOT_EDITABLE: "La categoría no existe o no se puede editar.",
  CATEGORY_NOT_DELETABLE: "La categoría no existe o no se puede eliminar.",
  INVALID_CATEGORY:
    "La categoría seleccionada no es válida. Elige otra categoría.",
  TRANSACTION_NOTFOUND: "La transacción no existe o fue eliminada.",
  INVALID_PERIOD: "El período seleccionado no es válido. Elige otro.",
} as const;

export type MutationErrorCode = keyof typeof MUTATION_ERROR_MESSAGES;

export const DEFAULT_MUTATION_ERROR_MESSAGE =
  "No se pudo completar la operación. Inténtalo de nuevo.";

export function getMutationErrorMessage(code: string): string {
  return (
    MUTATION_ERROR_MESSAGES[code as MutationErrorCode] ??
    DEFAULT_MUTATION_ERROR_MESSAGE
  );
}