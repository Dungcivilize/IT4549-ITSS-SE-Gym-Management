import random

results = [
    "Tiến bộ tốt",
    "Cần cải thiện kỹ thuật",
    "Cần cải thiện sức bền",
    "Rất chăm chỉ",
    "Chưa đạt yêu cầu buổi tập",
    "Tương tác tốt với HLV",
    "Nên tập trung hơn",
    "Thể lực cải thiện rõ rệt",
    "Thái độ tích cực",
    "Đề xuất tập thêm cardio"
]

feedback_id = 1
for _ in range(150):  # tạo 150 feedback ngẫu nhiên
    trainer_id = random.randint(1, 54)
    member_id = random.randint(1, 46)
    result = random.choice(results)

    sql = f"INSERT INTO `TrainingFeedback` (`feedback_id`, `trainer_id`, `member_id`, `result`) VALUES ({feedback_id}, {trainer_id}, {member_id}, '{result}');"
    print(sql)
    feedback_id += 1
