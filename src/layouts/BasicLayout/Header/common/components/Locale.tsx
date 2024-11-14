import { FC } from 'react';
import { useLocale } from '@/locales/hooks';
import { setLocale } from 'umi';
import { Select } from 'antd';

const Locale: FC = () => {
  const locale = useLocale();

  const handleChange = (localeValue: string) => {
    setLocale(localeValue, false);
  };

  return (
    <>
      <Select
        value={locale}
        style={{ width: 100 }}
        onChange={handleChange}
        options={[
          {
            value: 'zh-CN',
            label: '中文',
          },
          {
            value: 'en-US',
            label: 'English',
          },
          {
            value: 'ja-JP',
            label: '日本語',
          },
        ]}
      />
    </>
  );
};

export default Locale;
