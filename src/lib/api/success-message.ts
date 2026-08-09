

export const MUTATION_SUCCESS_MESSAGES = {
  USER_REGISTERED: "Tu cuenta fue creada correctamente.",
  LOGIN_SUCCESS: "Inicio de sesión exitoso.",
  LOGOUT_SUCCESS: "Sesión cerrada exitosamente.",
  ACCOUNT_DELETED: "Tu cuenta fue eliminada junto con todos sus datos.",
  EMAIL_CHECKED: "Consulta de correo completada.",
  MAGIC_LINK_SENT:
    "Se ha enviado un enlace de acceso a tu correo electrónico.",
  CODE_SENT: "Se ha enviado un código de verificación a tu correo.",
  CODE_VERIFIED: "Código verificado correctamente.",
  TOKEN_REFRESHED: "Tu sesión fue renovada correctamente.",
  MAGIC_LOGIN_SUCCESS: "Inicio de sesión exitoso.",
  CATEGORIES_LISTED: "Categorías obtenidas correctamente.",
  CATEGORY_CREATED: "La categoría fue creada correctamente.",
  CATEGORY_UPDATED: "La categoría fue actualizada correctamente.",
  CATEGORY_DELETED: "La categoría fue eliminada correctamente.",
  TRANSACTION_CREATED: "La transacción fue creada correctamente.",
  TRANSACTION_UPDATED: "La transacción fue actualizada correctamente.",
  TRANSACTION_DELETED: "La transacción fue eliminada correctamente.",
  TRANSACTIONS_LISTED: "Transacciones obtenidas correctamente.",
  SUMMARY_GENERATED: "El resumen financiero fue generado correctamente.",
  PROFILE_FETCHED: "Perfil obtenido correctamente.",
  PROFILE_UPDATED: "Tu perfil fue actualizado correctamente.",
  AVATAR_UPDATED: "Tu avatar fue actualizado correctamente.",
  PARAMS_RETRIEVED: "Parámetros obtenidos correctamente.",
} as const;

export type MutationSuccessCode = keyof typeof MUTATION_SUCCESS_MESSAGES;


export const DEFAULT_MUTATION_SUCCESS_MESSAGE =
  "La operación se completó correctamente.";



export function getMutationSuccessMessage(code: string): string {
  return (
    MUTATION_SUCCESS_MESSAGES[code as MutationSuccessCode] ??
    DEFAULT_MUTATION_SUCCESS_MESSAGE
  );
}
