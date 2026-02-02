# 🚗 ServiceLog
### Vehicle Maintenance Tracker

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green.svg) ![Status](https://img.shields.io/badge/Status-Active-success.svg)

**ServiceLog** is a minimal, offline-first mobile application designed to simplify vehicle maintenance tracking. Say goodbye to forgotten oil changes and missed service dates.

---

## 📥 Download
**[Download the latest Android APK](https://drive.google.com/file/d/1YonIhfc47hicagSbMnexLuaTDlcvBdH5/view?usp=sharing)**

---

## 📖 About

ServiceLog answers one simple question:
> **"I last serviced my car at 42,300 km. When is the next one due?"**

Built with privacy and simplicity in mind, ServiceLog stores all data locally on your device. No accounts, no cloud sync, no ads, and absolutely no tracking. Just you and your car.

## ✨ Key Features

- **🎯 Precision Tracking**: Automatically calculates your next service due date based on your odometer and service interval.
- **⚡ Offline-First**: Works 100% offline. No internet connection required.
- **🔒 Privacy Focused**: all data is stored locally (AsyncStorage). We don't collect a single byte of personal data.
- **🚀 Blazing Fast**: Launches in under 1 second. Zero bloat.
- **📝 Service History**: Keep a clean log of all past maintenance (Oil, Brakes, Filters, etc.).
- **⚙️ Customizable**: Set your preferred default service intervals.

## 🛠️ Tech Stack

ServiceLog is built with modern mobile web technologies for performance and maintainability:

- **Core**: [React Native](https://reactnative.dev/) (v0.83)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Storage**: [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/)
- **Styling**: Custom Theme System (No heavy UI libraries)

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)
- Android Studio / iOS Xcode (for simulators)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ServiceLog.git
   cd ServiceLog
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the App**
   
   *Android*
   ```bash
   npm run android
   ```
   
   *iOS*
   ```bash
   npm run ios
   ```

## 📸 Usage Guide

1. **Add a Service**: Tap the `+` button, enter your current odometer reading and service type (e.g., Oil Change).
2. **View Status**: The home screen immediately shows kilometers remaining until your next service.
3. **Mark Done**: When you complete a service, hit "Done" to log it to history and reset the cycle.

## 🛡️ Privacy Policy

**Your Data is Yours.**
ServiceLog does not connect to any servers. All database files remain on your device. Deleting the app deletes all data.

---

Made with ❤️ by Haseeb
