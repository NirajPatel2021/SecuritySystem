import 'package:flutter/material.dart';
import 'dart:io' show Platform;
import 'package:http/http.dart' as http;

import 'entertoken.dart';

class NeighborsPage extends StatefulWidget {
  @override
  _NeighborsPage createState() => _NeighborsPage();
}

class _NeighborsPage extends State<NeighborsPage> {
  String? _errorText = "";


  send(String email, BuildContext context) async {
    final response = await http.get(
      Uri.parse(getUrlForDevice(email)),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );

    if (response.statusCode != 200) {
      setState(() => _errorText = response.body);
    } else {

    }
  }

  String getUrlForDevice(String email) {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:8080/api/mediax/getAllSharedMediax';
    } else {
      return 'http://localhost:8080/api/mediax/getAllSharedMediax';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFFFFFF),
      appBar: AppBar(
        title: const Text('Neighbors'),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: const <Widget>[
              Padding(
                padding: EdgeInsets.all(10),
                child: Text("Enter a valid email to receive reset token!\n\n",
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        height: 1.25,
                        fontSize: 25,
                        color: Colors.black)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
