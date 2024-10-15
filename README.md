# @mozart25/native-react-bridge

This package provides a `NativeBridge` class and `useNativeBridge` hook for communicating between native code and React web views.

## Installation

```bash
npm install @mozart25/native-react-bridge
```

# Usage(사용법)

## Using NativeBridge class

```javascript
import { NativeBridge } from "@mozart25/native-react-bridge";

const bridge = new NativeBridge();

// Send data to native
bridge.sendDataToNative({ message: "Hello from React!" });
```

## Using useNativeBridge hook

```javascript
import { useNativeBridge } from "@mozart25/native-react-bridge";

const MyComponent = () => {
  const { nativeData, sendDataToNative } = useNativeBridge();

  return (
    <div>
      <button onClick={() => sendDataToNative({ message: "Hello Native!" })}>
        Send Data to Native
      </button>
      {nativeData && <p>Received from native: {JSON.stringify(nativeData)}</p>}
    </div>
  );
};
```

## ios Swift

```swift
import WebKit

class WebViewController: UIViewController, WKScriptMessageHandler {
    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        // WKWebView 설정
        let contentController = WKUserContentController()
        contentController.add(self, name: "iosHandler")  // 메시지 핸들러 추가

        let config = WKWebViewConfiguration()
        config.userContentController = contentController

        webView = WKWebView(frame: self.view.bounds, configuration: config)
        view.addSubview(webView)

        // 웹페이지 로드
        if let url = URL(string: "https://your-react-webview-url.com") {
            webView.load(URLRequest(url: url))
        }
    }

    // JavaScript에서 수신한 메시지 처리
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "iosHandler" {
            print("Message from JS: \(message.body)")
            // JS에서 보낸 메시지를 처리하는 로직
        }
    }
}
```

## android Kotlin

```kotlin
import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        // JavaScript 설정 활성화
        webView.settings.javaScriptEnabled = true

        // Android 브릿지 추가 (JavascriptInterface)
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidBridge")

        // 웹 페이지 로드
        webView.loadUrl("https://your-react-webview-url.com")

        // WebView 클라이언트 설정
        webView.webViewClient = WebViewClient()
    }

    // 네이티브에서 웹으로 데이터 전송
    fun sendDataToWeb(data: String) {
        webView.post {
            webView.evaluateJavascript("window.receiveDataFromNative('$data')", null)
        }
    }

    // JavascriptInterface 클래스
    class WebAppInterface(private val activity: MainActivity) {

        @JavascriptInterface
        fun receiveMessage(message: String) {
            // React에서 받은 데이터를 처리하는 로직
            println("Message from React: $message")
            // 네이티브에서 웹으로 데이터 보내기
            activity.sendDataToWeb("{\"message\": \"Hello from Android Native!\"}")
        }
    }
}

```

## License

MIT
