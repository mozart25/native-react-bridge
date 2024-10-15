class NativeBridge {
  constructor() {
    this.platform = this.detectPlatform();
  }

  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return "android";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "ios";
    } else {
      return "web";
    }
  }

  sendDataToNative(data) {
    const message = JSON.stringify(data);

    if (this.platform === "android") {
      if (window.AndroidBridge && window.AndroidBridge.receiveMessage) {
        window.AndroidBridge.receiveMessage(message);
      }
    } else if (this.platform === "ios") {
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.iosHandler
      ) {
        window.webkit.messageHandlers.iosHandler.postMessage(message);
      } else {
        console.error("iOS WebView의 messageHandlers가 존재하지 않습니다.");
      }
    } else {
      console.error("이 환경에서는 네이티브 메시지를 보낼 수 없습니다.");
    }
  }

  setOnReceiveDataCallback(callback) {
    if (this.platform === "android") {
      window.receiveMessageFromNative = callback;
    } else if (this.platform === "ios") {
      window.receiveMessageFromNative = callback;
    }
  }
}

export default NativeBridge;
