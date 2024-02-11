import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Bars3CenterLeftIcon } from 'react-native-heroicons/outline';

const PopupMenu = ({ menuVisible, setMenuVisible, onNotificationPress, onReportIssuePress, onUnitsPress }) => {
  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Toggle visibility using setMenuVisible function
  };

  return (
    <View style={{ position: 'absolute', top: 30, right: 10, zIndex: 70 }}>
      <TouchableOpacity onPress={toggleMenu} style={{ padding: 10 }}>
        <Bars3CenterLeftIcon size={40} color="white" />
      </TouchableOpacity>
      <Modal visible={menuVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 10 }}>
            <TouchableOpacity onPress={onNotificationPress}  style={{ paddingVertical: 10 }}>
              <Text>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReportIssuePress} style={{ paddingVertical: 10 }}>
              <Text>Signaler un problème</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onUnitsPress} style={{ paddingVertical: 10 }}>
              <Text>Unités</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: 'blue' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default PopupMenu;