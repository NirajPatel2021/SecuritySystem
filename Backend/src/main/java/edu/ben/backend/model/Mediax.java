package edu.ben.backend.model;

import lombok.*;

import javax.persistence.*;

@Entity
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(name = "mediax")
public class Mediax {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(name = "userid")
    Long userid;
    //If the file is local file, then true, otherwise false, meaning it is stored in s3
    @Column(name = "islocal")
    boolean islocal;
    //If it is a video then true otherwise it is an image
    @Column(name = "isvideo")
    boolean isvideo;
    //if it's local then there will be local path, if it is stored in s3 then this is the aws object key
    @Column(name = "pathorkey")
    String pathorkey;
    @Column(name = "filename")
    String filename;
    @Column(name = "location")
    String location;
    @Column(name = "timestamp")
    String timestamp;

    public Mediax(Long userid, boolean islocal, boolean isvideo, String pathorkey, String filename, String location, String timestamp) {
        this.userid = userid;
        this.islocal = islocal;
        this.isvideo = isvideo;
        this.pathorkey = pathorkey;
        this.filename = filename;
        this.location = location;
        this.timestamp = timestamp;
    }

}