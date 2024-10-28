import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_barcode_scanner/flutter_barcode_scanner.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class Location {
  String id;
  final String code;
  String designation1;
  String designation2;

  Location({
    required this.id,
    required this.code,
    required this.designation1,
    required this.designation2,
  });
}

class Immobilisation {
  final String code;
  String designation1;
  String designation2;
  String locationId;

  Immobilisation({
    required this.code,
    required this.designation1,
    required this.designation2,
    required this.locationId,
  });
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Inventory immo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Inventory immo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String _scanLocationResult = '';
  String _scanImmoResult = '';
  List<String> _scannedCodes = [];
  List<Location> _locationsList = [];
  Map<String, Immobilisation> _immobilisationsMap = {};

  @override
  void initState() {
    super.initState();
    _fetchLocations();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton.icon(
              onPressed: scanLocation,
              icon: Icon(Icons.location_on),
              label: Text("Scan Location"),
              style: ElevatedButton.styleFrom(
                primary: Colors.blue,
                textStyle: TextStyle(fontSize: 20),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: scanImmo,
              icon: Icon(Icons.qr_code),
              label: Text("Scan Immobilisation"),
              style: ElevatedButton.styleFrom(
                primary: Colors.blue,
                textStyle: TextStyle(fontSize: 20),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: saveInventory,
              child: Text("Sauvegarder"),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: viewInventory,
              child: Text("Liste Inventoriée"),
            ),
            SizedBox(height: 40),
            Expanded(
              child: ListView.builder(
                itemCount: _scannedCodes.length,
                itemBuilder: (BuildContext context, int index) {
                  final code = _scannedCodes[index];
                  final isLocation =
                      _locationsList.any((location) => location.code == code);
                  final designation1 = isLocation
                      ? _locationsList
                          .firstWhere((location) => location.code == code)
                          .designation1
                      : _immobilisationsMap[code]?.designation1 ?? '';
                  final designation2 = isLocation
                      ? _locationsList
                          .firstWhere((location) => location.code == code)
                          .designation2
                      : _immobilisationsMap[code]?.designation2 ?? '';

                  return ListTile(
                    title: Text(
                        'Scanned Code ${index + 1}: $code\nDesignation 1: $designation1\nDesignation 2: $designation2'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit),
                          onPressed: () {
                            _editItem(code);
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.delete),
                          onPressed: () {
                            _deleteItem(code);
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void scanLocation() async {
    String locationScanRes;
    try {
      locationScanRes = await FlutterBarcodeScanner.scanBarcode(
        "#ff6666",
        "Cancel",
        true,
        ScanMode.BARCODE,
      );
    } on PlatformException {
      locationScanRes = "";
      locationScanRes = "Failed to get platform version";
    }

    if (locationScanRes.isNotEmpty) {
      _showDesignationDialog(locationScanRes, (designation1, designation2) {
        setState(() {
          _scanLocationResult = locationScanRes;
          _scannedCodes.add(locationScanRes);
          _locationsList.add(Location(
            id: '', // Since the id is coming from the database, it will be updated later
            code: locationScanRes,
            designation1: designation1,
            designation2: designation2,
          ));
        });
      });
    }
  }

  void scanImmo() async {
    String immoScanRes;
    try {
      immoScanRes = await FlutterBarcodeScanner.scanBarcode(
        "#ff6666",
        "Cancel",
        true,
        ScanMode.BARCODE,
      );
    } on PlatformException {
      immoScanRes = "Failed to get platform version";
    }

    if (immoScanRes.isNotEmpty) {
      final selectedLocation = await _showLocationSelectionDialog();
      if (selectedLocation != null) {
        _showDesignationDialog(immoScanRes, (designation1, designation2) {
          setState(() {
            _scanImmoResult = immoScanRes;
            _scannedCodes.add(immoScanRes);
            _immobilisationsMap[immoScanRes] = Immobilisation(
              code: immoScanRes,
              designation1: designation1,
              designation2: designation2,
              locationId:
                  selectedLocation.code, // Using location code as locationId
            );
          });
        });
      }
    }
  }

  void _showDesignationDialog(String code, Function(String, String) callback) {
    String designation1 = '';
    String designation2 = '';

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Saisissez vos désignations pour le code :$code'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                onChanged: (value) => designation1 = value,
                decoration: InputDecoration(hintText: 'Désignation 1'),
              ),
              TextField(
                onChanged: (value) => designation2 = value,
                decoration: InputDecoration(hintText: 'Désignation 2'),
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Annuler'),
            ),
            ElevatedButton(
              onPressed: () {
                callback(designation1, designation2);
                Navigator.of(context).pop();
              },
              child: Text('Enregistrer'),
            ),
          ],
        );
      },
    );
  }

  void saveInventory() async {
    // Saving locations
    for (var location in _locationsList) {
      await saveLocation(location);
    }
    // Saving immobilisations
    for (var code in _immobilisationsMap.keys) {
      await saveImmobilisation(_immobilisationsMap[code]!);
    }

    setState(() {
      _scannedCodes.clear();
    });
    print("Inventory Saved");
  }

  Future<void> saveLocation(Location location) async {
    final url = 'http://10.10.8.202:2000/api/locations/save';
    final response = await http.post(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'code': location.code,
        'designation1': location.designation1,
        'designation2': location.designation2,
      }),
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      setState(() {
        location.id = responseData['id'];
      });
      print(
          'Location saved successfully, ${location.code}, ${location.designation1}, ${location.designation2}');
    } else {
      print('Failed to save location: ${response.statusCode}');
    }
  }

  Future<void> saveImmobilisation(Immobilisation immobilisation) async {
    final url = 'http://10.10.8.202:2000/api/immobilisations/save';
    final response = await http.post(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'code': immobilisation.code,
        'designation1': immobilisation.designation1,
        'designation2': immobilisation.designation2,
        'locationID': immobilisation.locationId,
      }),
    );

    if (response.statusCode == 200) {
      print('Immobilisation saved successfully');
    } else {
      print('Failed to save immobilisation: ${response.statusCode}');
    }
  }

  void viewInventory() async {
    final url = 'http://10.10.8.202:2000/api/locations';
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List<dynamic>;
      setState(() {
        _locationsList.clear();
        for (var item in data) {
          final location = Location(
            id: item['id'],
            code: item['code'],
            designation1: item['designation1'],
            designation2: item['designation2'],
          );
          _locationsList.add(location);
          _scannedCodes.add(item['code']);
        }
      });
    } else {
      print('Failed to fetch inventory: ${response.statusCode}');
    }
  }

  Future<Location?> _showLocationSelectionDialog() async {
    return await showDialog<Location>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Sélectionnez une location pour l\'immobilisation'),
          content: DropdownButton<Location>(
            items: _locationsList
                .map<DropdownMenuItem<Location>>((Location location) {
              return DropdownMenuItem<Location>(
                value: location,
                child: Text(location.designation1),
              );
            }).toList(),
            onChanged: (Location? selectedLocation) {
              Navigator.of(context).pop(selectedLocation);
            },
          ),
        );
      },
    );
  }

  void _editItem(String code) async {
    // Handle editing immobilisations
    if (_immobilisationsMap.containsKey(code)) {
      final selectedLocation = await _showLocationSelectionDialog();
      if (selectedLocation != null) {
        _showDesignationDialog(code, (designation1, designation2) async {
          setState(() {
            _immobilisationsMap[code]!.designation1 = designation1;
            _immobilisationsMap[code]!.designation2 = designation2;
            _immobilisationsMap[code]!.locationId = selectedLocation.code;
          });

          final immobilisation = _immobilisationsMap[code]!;
          await updateImmobilisation(immobilisation);
        });
      }
    }
  }

  void _deleteItem(String code) async {
    setState(() {
      _scannedCodes.remove(code);
      _immobilisationsMap.remove(code);
    });

    await deleteItemFromBackend(code);
  }

  Future<void> updateImmobilisation(Immobilisation immobilisation) async {
    final url = 'http://10.10.8.202:2000/api/immobilisations/update';
    final response = await http.put(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'code': immobilisation.code,
        'designation1': immobilisation.designation1,
        'designation2': immobilisation.designation2,
        'locationID': immobilisation.locationId,
      }),
    );

    if (response.statusCode == 200) {
      print('Immobilisation updated successfully');
    } else {
      print('Failed to update immobilisation: ${response.statusCode}');
    }
  }

  Future<void> deleteItemFromBackend(String code) async {
    final url = 'http://10.10.8.202:2000/api/immobilisations/delete/$code';
    final response = await http.delete(
      Uri.parse(url),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );

    if (response.statusCode == 200) {
      print('Item deleted successfully');
    } else {
      print('Failed to delete item: ${response.statusCode}');
    }
  }

  void _fetchLocations() async {
    final url = 'http://10.10.8.202:2000/api/locations';
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List<dynamic>;
      setState(() {
        _locationsList.clear();
        for (var item in data) {
          final location = Location(
            id: item['id'],
            code: item['code'],
            designation1: item['designation1'],
            designation2: item['designation2'],
          );
          _locationsList.add(location);
          _scannedCodes.add(item['code']);
        }
      });
    } else {
      print('Failed to fetch locations: ${response.statusCode}');
    }
  }
}
