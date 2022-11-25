import type { FC, ReactNode } from "react";
import { useState, createContext, useEffect } from "react";

import { PrivateKey } from "@hashgraph/sdk";

interface IContextProvider {
  children: ReactNode;
}

type HashValue = {
  sigBytes?: number;
  words?: string[];
};

type UserData = {
  AESKey?: string;
  NicekName?: string;
  hash?: HashValue;
  iterations?: number;
  iv?: HashValue;
  salt?: HashValue;
};

type Settings = {
  userKeyInfo?: string;
  userData?: UserData;
  hashconnectData?: {
    encryptionKey?: string;
    pairingData: any[];
    pairingString?: string;
    topic?: object | null;
  };
};

type SettingsContextValue = {
  settings: Settings;
  saveSettings: (update: Settings) => void;
};

export const initialSettings = {
  userKeyInfo: "",
  userData: {
    AESKey: "",
    iterations: 0,
  },
  hashconnectData: {
    encryptionKey: "",
    pairingData: [],
    pairingString: "",
    topic: {},
  },
};

const restoreSettings = () => {
  let settings = null;
  try {
    let userKeyInfo = localStorage.getItem("userKeyInfo");
    let userData = localStorage.getItem("userData");
    let hashconnectData = localStorage.getItem("hashconnectData");
    if (userKeyInfo && userData && hashconnectData) {
      settings = {
        userKeyInfo: JSON.parse(userKeyInfo),
        userData: JSON.parse(userData),
        hashconnectData: JSON.parse(hashconnectData),
      };
    } else settings = initialSettings;
  } catch (e) {
    console.log(e);
  }

  return settings;
};

const storeSettings = (updatedSettings: Settings) => {
  localStorage.setItem(
    "userKeyInfo",
    JSON.stringify(updatedSettings.userKeyInfo)
  );
  localStorage.setItem("userData", JSON.stringify(updatedSettings.userData));
  localStorage.setItem(
    "hashconnectData",
    JSON.stringify(updatedSettings.hashconnectData)
  );
};

const SettingContext = createContext<SettingsContextValue>({
  settings: initialSettings,
  saveSettings: () => {},
});

const ContextProvider: FC<IContextProvider> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    const restored = restoreSettings();
    if (restored) {
      setSettings(restored);
    }
  }, []);

  const saveSettings = (updatedSettings: Settings) => {
    setSettings(updatedSettings);
    storeSettings(updatedSettings);
  };

  return (
    <SettingContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingContext.Provider>
  );
};

export { SettingContext };
export { ContextProvider };
