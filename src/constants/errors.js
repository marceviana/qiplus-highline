
const locale = 'pt-br';

const errors = {
  en: {
    // Defaults
    default: 'Hmm, an unknown error occured',
    timeout: 'Server Timed Out. Check your internet connection',
    invalidJson: 'Response returned is not valid JSON',

    // Firebase Related
    invalidFirebase: 'Firebase is not connected correctly',

    // Member
    memberExists: 'Member already exists',
    missingFirstName: 'First name is missing',
    missingLastName: 'Last name is missing',
    missingEmail: 'Email is missing',
    missingPassword: 'Password is missing',
    passwordsDontMatch: 'Passwords do not match',

    // Recipes
    recipe404: 'Recipe not found',
    missingMealId: 'Missing meal definition',

    // Events
    event404: 'Evento não encontrado',
    missingEventId: 'Não encontrado',

    // Locale
    localeDoesNotExist: 'Sorry, we do not support that local',
  },
  'pt-br': {
    // Defaults
    default: 'Hmm, ocorreu um erro inesperado',
    timeout: 'Server Timed Out. Check your internet connection',
    invalidJson: 'Response returned is not valid JSON',

    // Firebase Related
    invalidFirebase: 'Firebase is not connected correctly',

    // Member
    memberExists: 'Este usuário já existe em nosso banco de dados',
    missingFirstName: 'Complete o campo "Nome"',
    missingLastName: 'Complete o campo "Sobrenome"',
    missingEmail: 'Complete o campo "Email"',
    missingPassword: 'Complete o campo "Senha"',
    passwordsDontMatch: 'As senhas não coincidem',

    // Recipes
    recipe404: 'Recipe not found',
    missingMealId: 'Missing meal definition',

    // Events
    event404: 'Evento não encontrado',
    missingEventId: 'Não encontrado',

    // Locale
    localeDoesNotExist: 'Desculpe, ainda não damos suporte a esta língua',
  },
};

export default errors[locale];
