import { useEffect, useState } from "react";
import NativeBridge from "./NativeBridge";

const useNativeBridge = () => {
  const [nativeData, setNativeData] = useState(null);
  const bridge = new NativeBridge();

  useEffect(() => {
    // 네이티브로부터 데이터를 받을 때 콜백 설정
    bridge.setOnReceiveDataCallback((data) => {
      setNativeData(JSON.parse(data));
    });

    // 컴포넌트가 언마운트될 때 콜백 해제
    return () => {
      bridge.setOnReceiveDataCallback(null);
    };
  }, [bridge]);

  // 네이티브로 데이터를 보내는 함수
  const sendDataToNative = (data) => {
    bridge.sendDataToNative(data);
  };

  return { nativeData, sendDataToNative };
};

export default useNativeBridge;
