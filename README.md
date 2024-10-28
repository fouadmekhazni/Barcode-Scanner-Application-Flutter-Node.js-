
# Barcode Scanner Application with Flutter & Node.js

This is a Barcode Scanner Application built using Flutter for the front end and Node.js with Microsoft SQL Server (MSSQL) for the back end. The application allows users to scan barcodes using their device camera and retrieve relevant product information from a database.

## Features

- **Barcode Scanning:** Utilize the device camera to scan various barcode formats.
- **Real-time Data Retrieval:** Fetch product details from the MSSQL database based on the scanned barcode.
- **User-Friendly Interface:** Simple and intuitive UI built with Flutter.
- **Cross-Platform:** Compatible with both Android and iOS devices.

## Technologies Used

- **Frontend:** 
  - Flutter
  - Dart
  - [camera package](https://pub.dev/packages/camera) for accessing the device camera
  - [barcode_scan package](https://pub.dev/packages/barcode_scan) for scanning barcodes

- **Backend:**
  - Node.js
  - Express.js
  - [mssql package](https://www.npmjs.com/package/mssql) for connecting to MSSQL
  - RESTful API for communication between frontend and backend

## Installation

### Prerequisites

- Flutter SDK
- Node.js and npm
- Microsoft SQL Server (MSSQL)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Barcode-Scanner-Application-Flutter-Node.js.git
