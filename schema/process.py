f = open("process_data.txt", "r")

dataList = []

for line in f:
    data = line.split("\t")
    if (data[2] == "Male\n"):
        data[2] = "M"
    else:
        data[2] = "F"
    data.append("E")
    data.append("2022")
    data.append("CB")
    data.append("CSE")

    dataList.append(data)

g = open("CSE_E.txt", "w")
for data in dataList:
    g.write(f"INSERT INTO student (rollNo, fullName, gender, section, batch, campus, dept) VALUES ('{data[0]}', '{data[1]}', '{data[2]}', '{data[3]}', '{data[4]}', '{data[5]}', '{data[6]}');\n")

f.close()