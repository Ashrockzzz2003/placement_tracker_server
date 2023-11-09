f = open("StudentData.txt", "r")

dataList = []

for line in f:
    data = line.split("\t")
    dataList.append(data)


g = open("./schema\placementData.sql", "w")
for data in dataList:
    g.write(f"insert into placementData(studentID,companyID,ctc,jobRole,placementDate,isIntern,isPPO,isOnCampus,isGirlsDrive,createdAt) values( {int(data[0])} , {int(data[1])} , {float(data[2])} , '{data[3]}' , '{data[4]}' , '{data[5]}' , '{data[6]}' , '{data[7]}' , '{data[8]}' , '{data[9]}'); \n")
g.close()
f.close()

