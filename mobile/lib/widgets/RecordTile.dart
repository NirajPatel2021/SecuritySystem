import 'package:flutter/material.dart';
import 'package:mobile/models/mediax.dart';
import 'package:mobile/pages/mediax_detail.dart';

class RecordTile extends StatefulWidget {
  final Mediax mediaxObject;
  RecordTile(this.mediaxObject, Divider divider, {Key? key}) : super(key: key);

  @override
  State<RecordTile> createState() => _RecordTileState();
}

class _RecordTileState extends State<RecordTile> {
  @override
  Widget build(BuildContext context) {
    print(widget.mediaxObject);
    print("BIGBROOOOOOO");
    return Padding(
        padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
        child: PhysicalModel(
            color: Colors.white,
            elevation: 18,
            shadowColor: Colors.black,
            borderRadius: BorderRadius.circular(20),
            child: SizedBox(

                /// Enter your fixed width here, 300.0 ist just an example
                width: 1020.0,
                child: ListTile(
                  minLeadingWidth: 1000,
                  tileColor: Colors.white,
                  title: Text(widget.mediaxObject.filename,
                      style: TextStyle(
                          fontFamily: "Trajan Pro",
                          height: 1.0,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF303030))),
                  subtitle: Text(widget.mediaxObject.location,
                      style: TextStyle(
                          fontFamily: "Trajan Pro",
                          height: 1.0,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF303030))),
                  //trailing: Text(widget.mediaxObject.timestamp),
                  onTap: () {
                    //When user clicks the row/tile they go to the song's detail page

                    Navigator.push(
                        context,
                        new MaterialPageRoute(
                            builder: (context) =>
                                MediaxDetailPage(widget.mediaxObject)));
                  },
                ))));
  }
}
