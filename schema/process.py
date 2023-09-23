f = open("d:\Projects\Placements\placement_tracker_server\schema\StudentData.txt", "r")

dataList = []

for line in f:
    #data = line.split("\t")
    data=[line]
    data.append('000000')
    data.append('2021-05-05')
    dataList.append(data)


g = open("d:\Projects\Placements\placement_tracker_server\schema\studentRegister.sql", "w")
for data in dataList:
    g.write(f"insert into studentRegister (studentEmail,otp,createdAt) values('{data[0]}','{data[1]}','{data[2]}');\n")
g.close()
f.close()

