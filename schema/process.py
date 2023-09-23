f = open("d:\Projects\Placements\placement_tracker_server\schema\StudentData.txt", "r")

dataList = []

for line in f:
    data = line.split("\t")
    data[3]=data[3][0]
    if data[7]!="0":
        data[7]="1"
    dataList.append(data)


g = open("d:\Projects\Placements\placement_tracker_server\schema\CSE_E.sql", "w")
for data in dataList:
    g.write(f"INSERT INTO studentData (studentRollNo, studentName, studentSection, studentGender, studentBatch, studentDept, isHigherStudies, isPlaced, createdAt) VALUES ('{data[0]}', '{data[1]}', '{data[2]}', '{data[3]}', '{data[4]}', '{data[5]}', '{data[6]}','{data[7]}','{data[8]}');\n")

f.close()