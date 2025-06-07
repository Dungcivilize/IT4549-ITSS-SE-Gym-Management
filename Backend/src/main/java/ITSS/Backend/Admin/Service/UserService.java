package ITSS.Backend.Admin.Service;

import ITSS.Backend.Admin.DTO.UserRequestDTO;
import ITSS.Backend.Admin.DTO.UserResponseDTO;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Chuyển User entity sang UserResponseDTO
    private UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getUserId());
        dto.setFullname(user.getFullname());
        dto.setEmail(user.getEmail());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        return dto;
    }

    // Tạo User mới
    public UserResponseDTO createUser(UserRequestDTO dto) {
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        user.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        user.setFullname(dto.getFullname());
        user.setAddress(dto.getAddress());
        user.setDateOfBirth(dto.getDateOfBirth());

        User savedUser = userRepository.save(user);
        return toResponseDTO(savedUser);
    }

    // Lấy danh sách user
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    // Lấy user theo id
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if(user == null) return null;
        return toResponseDTO(user);
    }

    // Cập nhật user
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id).orElse(null);
        if(user == null) return null;

        // Cập nhật các trường nếu có trong dto
        if(dto.getUserName() != null) user.setUserName(dto.getUserName());
        if(dto.getPassword() != null) user.setPassword(dto.getPassword());
        if(dto.getEmail() != null) user.setEmail(dto.getEmail());
        if(dto.getPhone() != null) user.setPhone(dto.getPhone());
        if(dto.getRole() != null) user.setRole(dto.getRole());
        if(dto.getFullname() != null) user.setFullname(dto.getFullname());
        if(dto.getAddress() != null) user.setAddress(dto.getAddress());
        if(dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());

        User updatedUser = userRepository.save(user);
        return toResponseDTO(updatedUser);
    }

    // Xoá user
    public boolean deleteUser(Long id) {
        if(!userRepository.existsById(id)) {
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }
}
