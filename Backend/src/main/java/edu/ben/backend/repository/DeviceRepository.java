package edu.ben.backend.repository;

import edu.ben.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository  extends JpaRepository<Device, Long> {
    List<Device> findAllByUserid(Long userid);
    Device findByDefaultdevice(boolean isDefault);
    Device findByMacaddress(String macAddress);
    Device getBymacaddress(String macaddress);
}
