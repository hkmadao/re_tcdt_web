import { useIntl } from 'umi';
import { TLocale } from '..';

type MessageIdType = keyof TLocale;

const formatMessage = (
  idMsg: MessageIdType,
  formatMessage: (descriptor: { id: string }) => string,
) => {
  return formatMessage({
    id: idMsg,
  });
};

export const useLocale = () => {
  const intl = useIntl();
  return intl.locale;
};

export const useLoginLocaleMsg = () => {
  const intl = useIntl();

  const successMsg = formatMessage(
    'system.login.success.msg',
    intl.formatMessage,
  );
  const failMsg = formatMessage('system.login.fail.msg', intl.formatMessage);
  const loginText = formatMessage('system.login', intl.formatMessage);
  const usernameText = formatMessage(
    'system.login.username',
    intl.formatMessage,
  );
  const passwordText = formatMessage(
    'system.login.password',
    intl.formatMessage,
  );
  const rememberText = formatMessage(
    'system.login.remember',
    intl.formatMessage,
  );

  return {
    successMsg,
    failMsg,
    loginText,
    usernameText,
    passwordText,
    rememberText,
  };
};

export const useLogoutLocaleMsg = () => {
  const intl = useIntl();

  const logoutMsg = formatMessage('system.logout', intl.formatMessage);
  const logoutSuccessMsg = formatMessage(
    'system.logout.success.msg',
    intl.formatMessage,
  );
  const logoutFailMsg = formatMessage(
    'system.logout.fail.msg',
    intl.formatMessage,
  );

  return {
    logoutMsg,
    logoutSuccessMsg,
    logoutFailMsg,
  };
};

export const useChangePasswdLocaleMsg = () => {
  const intl = useIntl();

  const changepawsswdText = formatMessage(
    'system.changepawsswd',
    intl.formatMessage,
  );
  const usernameText = formatMessage(
    'system.changepawsswd.username',
    intl.formatMessage,
  );
  const oldPasswordText = formatMessage(
    'system.changepawsswd.old',
    intl.formatMessage,
  );
  const newPasswordText = formatMessage(
    'system.changepawsswd.new',
    intl.formatMessage,
  );
  const checkedPasswordText = formatMessage(
    'system.changepawsswd.checked',
    intl.formatMessage,
  );
  const submitText = formatMessage(
    'system.changepawsswd.submit',
    intl.formatMessage,
  );

  return {
    changepawsswdText,
    usernameText,
    oldPasswordText,
    newPasswordText,
    checkedPasswordText,
    submitText,
  };
};

export const useProfileLocaleMsg = () => {
  const intl = useIntl();

  const profileText = formatMessage('system.profile', intl.formatMessage);
  const accountText = formatMessage(
    'system.profile.account',
    intl.formatMessage,
  );
  const nameText = formatMessage('system.profile.name', intl.formatMessage);
  const nickNameText = formatMessage(
    'system.profile.nickName',
    intl.formatMessage,
  );
  const emailText = formatMessage('system.profile.email', intl.formatMessage);
  const phoneText = formatMessage('system.profile.phone', intl.formatMessage);

  return {
    profileText,
    accountText,
    nameText,
    nickNameText,
    emailText,
    phoneText,
  };
};
