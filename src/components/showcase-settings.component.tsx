import React from 'react';
import { I18nManager, Platform, ViewProps } from 'react-native';
import { Updates } from 'expo';
import { Button, CheckBox, Layout, OverflowMenu, OverflowMenuItemType, useStyleSheet } from '@ui-kitten/components';
import { ColorPaletteIcon, SettingsIcon, TrashIcon } from './icons';
import { ComponentShowcaseSetting } from '../model/showcase.model';
import { Theme } from '../services/theme.service';

export interface ShowcaseSettingsProps extends ViewProps {
  themes?: Theme[];
  settings?: ComponentShowcaseSetting[];
  onThemeSelect?: (theme: Theme) => void;
  onSettingSelect?: (setting: { [prop: string]: any }) => void;
  onReset: () => void;
}

export const ShowcaseSettings = (props: ShowcaseSettingsProps): React.ReactElement => {

  const [themesMenuVisible, setThemesMenuVisible] = React.useState<boolean>(false);
  const [settingsMenuVisible, setSettingsMenuVisible] = React.useState<boolean>(false);

  const styles = StyleSheet.create();

  const createSettingMenuItem = (setting: ComponentShowcaseSetting): OverflowMenuItemType => {
    return {
      title: setting.description || `${setting.propertyName}: ${setting.value}`,
    };
  };

  const createThemeMenuItem = (title: string): OverflowMenuItemType => {
    return { title };
  };

  const onThemeSelect = (index: number): void => {
    props.onThemeSelect(props.themes[index]);
    setThemesMenuVisible(false);
  };

  const onResetButtonPress = (): void => {
    props.onReset();
  };

  const onSettingSelect = (index: number): void => {
    const { [index]: setting } = props.settings;

    props.onSettingSelect({
      [setting.propertyName]: setting.value,
    });

    setSettingsMenuVisible(false);
  };

  const createThemesMenuItems = (): OverflowMenuItemType[] => {
    return props.themes && props.themes.map(createThemeMenuItem);
  };

  const createSettingsMenuItems = (): OverflowMenuItemType[] => {
    const settings = props.settings && props.settings.map(createSettingMenuItem);
    return settings || [];
  };

  const toggleThemesMenu = (): void => {
    setThemesMenuVisible(!themesMenuVisible);
  };

  const toggleSettingsMenu = (): void => {
    setSettingsMenuVisible(!settingsMenuVisible);
  };

  const toggleRtl = (): void => {
    I18nManager.forceRTL(!I18nManager.isRTL);
    I18nManager.allowRTL(I18nManager.isRTL);
    Platform.OS !== 'web' && Updates.reload();
  };

  return (
    <Layout
      style={[styles.container, props.style]}
      level='2'>
      <OverflowMenu
        visible={themesMenuVisible}
        onSelect={onThemeSelect}
        data={createThemesMenuItems()}
        onBackdropPress={toggleThemesMenu}>
        <Button
          size='tiny'
          icon={ColorPaletteIcon}
          disabled={!props.themes}
          onPress={toggleThemesMenu}>
          THEMES
        </Button>
      </OverflowMenu>
      <OverflowMenu
        visible={settingsMenuVisible}
        onSelect={onSettingSelect}
        data={createSettingsMenuItems()}
        onBackdropPress={toggleSettingsMenu}>
        <Button
          size='tiny'
          icon={SettingsIcon}
          disabled={!props.settings}
          onPress={toggleSettingsMenu}>
          SETTINGS
        </Button>
      </OverflowMenu>
      <Button
        size='tiny'
        status='danger'
        icon={TrashIcon}
        disabled={!props.settings}
        onPress={onResetButtonPress}>
        RESET
      </Button>
      <CheckBox
        checked={I18nManager.isRTL}
        onChange={toggleRtl}
        text='RTL'
      />
    </Layout>
  );
};

const StyleSheet = useStyleSheet({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
  },
});
