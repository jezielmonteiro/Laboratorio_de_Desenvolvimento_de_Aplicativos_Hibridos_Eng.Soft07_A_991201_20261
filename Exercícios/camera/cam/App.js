import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);

  async function pedirPermissaoCamera() {
    try {
      const cam = await requestCameraPermission();

      if (!cam.granted) {
        Alert.alert(
          'Permissão necessária',
          'Você precisa liberar a câmera para continuar.'
        );
      }
    } catch (error) {
      console.error('Erro ao pedir permissão da câmera:', error);
      Alert.alert('Erro', 'Não foi possível solicitar a permissão da câmera.');
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    try {
      if (!cameraRef.current) {
        Alert.alert('Erro', 'Câmera não disponível.');
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (!photo?.uri) {
        Alert.alert('Erro', 'Não foi possível tirar a foto.');
        return;
      }

      setPhotoUri(photo.uri);
      setModalVisible(true);
      console.log('Foto tirada com sucesso:', photo.uri);
      console.log('Dados da foto (base64):', photo.base64?.substring(0, 100) + '...'); // Log apenas os primeiros caracteres do base64 para evitar poluição do console
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  }

  function fecharModal() {
    setModalVisible(false);
  }

  function tirarOutraFoto() {
    setPhotoUri(null);
    setModalVisible(false);
  }

  const cameraGranted = cameraPermission?.granted === true;

  if (!cameraGranted) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar style="dark" />
        <Text style={styles.message}>O app precisa de acesso à câmera.</Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={pedirPermissaoCamera}
        >
          <Text style={styles.permissionButtonText}>Permitir acesso</Text>
        </TouchableOpacity>

        <Text style={styles.smallText}>
          Se você já negou antes, talvez precise liberar manualmente nas
          configurações do celular.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlayTop}>
          <Text style={styles.title}>Camera App</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonFlip} onPress={toggleCameraFacing}>
            <Image style={styles.icon} source={require('./assets/flip.png')} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonTake} onPress={takePicture}>
            <Image style={styles.icon} source={require('./assets/cam_button.jpg')} />
          </TouchableOpacity>
        </View>
      </CameraView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Foto capturada</Text>

            {photoUri && (
              <Image
                source={{ uri: photoUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={fecharModal}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={tirarOutraFoto}
              >
                <Text style={styles.modalButtonText}>Tirar outra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  message: {
    color: '#f2bbce',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  smallText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
    color: '#f2bbce',
    lineHeight: 18,
  },
  permissionButton: {
    backgroundColor: '#f2bbce',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlayTop: {
    position: 'absolute',
    top: 60,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#f2bbce',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  icon: {
    width: '70%',
    height: '70%',
  },
  buttonFlip: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  buttonTake: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2bbce',
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#f2bbce',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 420,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#f2bbce',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});