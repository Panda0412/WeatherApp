import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(171, 172, 204, 0.6)',
  },
  headerText: {
    color: '#535399',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  defaultText: {
    color: '#535399',
  },
  modal: {
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: '#FFD6B0',
    borderWidth: 0.5,
    borderColor: '#CCB6AB',
    borderRadius: 30,
    padding: 15,
  },
  modalButton: {
    backgroundColor: 'rgba(204, 182, 171, 0.6)',
    width: '40%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#CCB6AB',
    borderRadius: 15,
    padding: 7,
    alignItems: 'center',
  },
});

export default function ModalView(props) {
  return (
    <Modal animationType={'fade'} visible={props.visible} transparent={true}>
      <View style={styles.body}>
        <View style={styles.modal}>
          <Text style={styles.headerText}>{props.mainText}</Text>
          <View style={styles.row}>
            {props.buttonTexts.map((buttonText, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={styles.modalButton}
                onPress={() => {
                  props.setVisible(false);
                  props.buttonCallbacks &&
                    props.buttonCallbacks[
                      props.buttonTexts.length - 1 - index
                    ] &&
                    props.buttonCallbacks[
                      props.buttonTexts.length - 1 - index
                    ]();
                }}>
                <Text style={styles.defaultText}>{buttonText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
