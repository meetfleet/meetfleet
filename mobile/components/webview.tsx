import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

type VimeoPlayerProps = {
    onVideoEnd: () => void; // <-- explicitly define the type
};

const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ onVideoEnd }) => {
    const webviewRef = useRef<WebView>(null);

    const htmlContent = `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; background:black;">
      <div style="padding:0;position:relative;width:100%;height:100%;">
        <iframe
          src="https://player.vimeo.com/video/1162307711?autoplay=1&muted=1&background=0"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          style="position:absolute;top:0;left:0;width:100%;height:100%;"
          id="vimeo-player"
        ></iframe>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
      <script>
        var iframe = document.getElementById('vimeo-player');
        var player = new Vimeo.Player(iframe);
        player.on('ended', function() {
          window.ReactNativeWebView.postMessage('ended');
        });
      </script>
    </body>
  </html>
  `;

    return (
        <View style={styles.container}>
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={styles.webview}
                javaScriptEnabled
                domStorageEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                onMessage={(event) => {
                    if (event.nativeEvent.data === 'ended') {
                        onVideoEnd(); // <-- safe now
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: 'black',
    },
    webview: {
        flex: 1,
        backgroundColor: 'black',
    },
});

export default VimeoPlayer;
