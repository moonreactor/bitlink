import type { SiteLang } from "./site";

export const AUTH: Record<
  SiteLang,
  {
    loginTitle: string;
    registerTitle: string;
    loginSub: string;
    registerSub: string;
    invited: (user: string) => string;
    pendingRegister: string;
    pendingLogin: string;
    username: string;
    usernamePlaceholder: string;
    displayName: string;
    displayNamePlaceholder: string;
    email: string;
    password: string;
    forgot: string;
    wait: string;
    login: string;
    createAccount: string;
    noAccount: string;
    signUp: string;
    haveAccount: string;
    usernameShort: string;
    passwordShort: string;
    loginFailed: string;
    registerFailed: string;
    loading: string;
    resetTitle: string;
    resetSub: string;
    sendReset: string;
    devLink: string;
    backToLogin: string;
    resetStartFailed: string;
    chooseTitle: string;
    chooseSub: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    missingToken: string;
    mismatch: string;
    resetFailed: string;
    requestNew: string;
  }
> = {
  en: {
    loginTitle: "Welcome back",
    registerTitle: "Create your page",
    loginSub: "Log in to edit your links.",
    registerSub: "Free forever. No credit card.",
    invited: (u) => `Free forever. Invited from @${u}.`,
    pendingRegister: "Your short link is waiting — create your account to see its clicks.",
    pendingLogin: "Log in to add your short link to your account and see its clicks.",
    username: "Username",
    usernamePlaceholder: "yourname",
    displayName: "Display name",
    displayNamePlaceholder: "Your Name",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    wait: "Please wait…",
    login: "Log in",
    createAccount: "Create account",
    noAccount: "No account?",
    signUp: "Sign up",
    haveAccount: "Already have one?",
    usernameShort: "Username must be at least 3 characters.",
    passwordShort: "Password must be at least 8 characters.",
    loginFailed: "Could not log in. Please try again.",
    registerFailed: "Could not create your account. Please try again.",
    loading: "Loading…",
    resetTitle: "Reset password",
    resetSub: "Enter your email and we’ll create a reset link.",
    sendReset: "Send reset link",
    devLink: "Dev reset link:",
    backToLogin: "Back to log in",
    resetStartFailed: "Could not start reset.",
    chooseTitle: "Choose a new password",
    chooseSub: "Then you’ll be signed in automatically.",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    updatePassword: "Update password",
    missingToken: "Missing reset token. Request a new link.",
    mismatch: "Passwords do not match.",
    resetFailed: "Could not reset password.",
    requestNew: "Request a new link",
  },
  es: {
    loginTitle: "Te damos la bienvenida",
    registerTitle: "Creá tu página",
    loginSub: "Iniciá sesión para editar tus links.",
    registerSub: "Gratis para siempre. Sin tarjeta de crédito.",
    invited: (u) => `Gratis para siempre. Te invitó @${u}.`,
    pendingRegister: "Tu link corto te está esperando: creá tu cuenta para ver sus clics.",
    pendingLogin: "Iniciá sesión para sumar tu link corto a tu cuenta y ver sus clics.",
    username: "Usuario",
    usernamePlaceholder: "tunombre",
    displayName: "Nombre para mostrar",
    displayNamePlaceholder: "Tu nombre",
    email: "Email",
    password: "Contraseña",
    forgot: "¿Olvidaste tu contraseña?",
    wait: "Un momento…",
    login: "Iniciar sesión",
    createAccount: "Crear cuenta",
    noAccount: "¿No tenés cuenta?",
    signUp: "Registrate",
    haveAccount: "¿Ya tenés una?",
    usernameShort: "El usuario debe tener al menos 3 caracteres.",
    passwordShort: "La contraseña debe tener al menos 8 caracteres.",
    loginFailed: "No pudimos iniciar sesión. Intentá de nuevo.",
    registerFailed: "No pudimos crear tu cuenta. Intentá de nuevo.",
    loading: "Cargando…",
    resetTitle: "Restablecer contraseña",
    resetSub: "Ingresá tu email y te creamos un link para restablecerla.",
    sendReset: "Enviar link de restablecimiento",
    devLink: "Link de prueba:",
    backToLogin: "Volver a iniciar sesión",
    resetStartFailed: "No pudimos iniciar el restablecimiento.",
    chooseTitle: "Elegí una nueva contraseña",
    chooseSub: "Después iniciarás sesión automáticamente.",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmá la contraseña",
    updatePassword: "Actualizar contraseña",
    missingToken: "Falta el token. Pedí un link nuevo.",
    mismatch: "Las contraseñas no coinciden.",
    resetFailed: "No pudimos restablecer la contraseña.",
    requestNew: "Pedir un link nuevo",
  },
  pt: {
    loginTitle: "Bem-vindo de volta",
    registerTitle: "Crie sua página",
    loginSub: "Entre para editar seus links.",
    registerSub: "Grátis para sempre. Sem cartão de crédito.",
    invited: (u) => `Grátis para sempre. Convite de @${u}.`,
    pendingRegister: "Seu link curto está esperando — crie sua conta para ver os cliques.",
    pendingLogin: "Entre para adicionar seu link curto à sua conta e ver os cliques.",
    username: "Nome de usuário",
    usernamePlaceholder: "seunome",
    displayName: "Nome de exibição",
    displayNamePlaceholder: "Seu nome",
    email: "E-mail",
    password: "Senha",
    forgot: "Esqueceu a senha?",
    wait: "Aguarde…",
    login: "Entrar",
    createAccount: "Criar conta",
    noAccount: "Não tem conta?",
    signUp: "Cadastre-se",
    haveAccount: "Já tem uma?",
    usernameShort: "O nome de usuário deve ter pelo menos 3 caracteres.",
    passwordShort: "A senha deve ter pelo menos 8 caracteres.",
    loginFailed: "Não foi possível entrar. Tente novamente.",
    registerFailed: "Não foi possível criar sua conta. Tente novamente.",
    loading: "Carregando…",
    resetTitle: "Redefinir senha",
    resetSub: "Informe seu e-mail e vamos criar um link de redefinição.",
    sendReset: "Enviar link de redefinição",
    devLink: "Link de teste:",
    backToLogin: "Voltar para o login",
    resetStartFailed: "Não foi possível iniciar a redefinição.",
    chooseTitle: "Escolha uma nova senha",
    chooseSub: "Depois você entrará automaticamente.",
    newPassword: "Nova senha",
    confirmPassword: "Confirme a senha",
    updatePassword: "Atualizar senha",
    missingToken: "Token ausente. Peça um novo link.",
    mismatch: "As senhas não coincidem.",
    resetFailed: "Não foi possível redefinir a senha.",
    requestNew: "Pedir um novo link",
  },
};
