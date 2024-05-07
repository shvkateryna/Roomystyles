from flask import Flask, request, jsonify
from flask_mongoengine import MongoEngine
import json
from flask_cors import CORS, cross_origin
from cryptography.fernet import Fernet, InvalidToken
from datetime import datetime
import pytz
from copy import deepcopy
import jwt
import uuid
from datetime import datetime, timedelta
from functools import wraps
# import requests

key = "Z6IIrLq-hAWCNUtSIvbOfeZ9LmPKy8QNFgpPFENyJ2U="
f = Fernet(key)

a = f.encrypt(b"641ed28737f82abe15c1ef83")

# Creating app
app = Flask(__name__)
cors = CORS(app)
app.config['MONGODB_SETTINGS'] = {
    'host': 'mongodb+srv://user:hqsydgafst#1@cluster0.md6y0vq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    # 'host':'mongodb+srv://nick:AFwhXGFyNZUtWvkY@cluster0.rg450ga.mongodb.net/database?retryWrites=true&w=majority'
}
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = "ASGJHSFVJANJCS67AGSD7A6SDGDASDg%&aSD8"
db = MongoEngine(app)




class SaveFurn(db.Document):
    type_expanded = db.StringField()
    images = db.ListField(db.StringField())
    description = db.StringField()
    
    def to_json(self):
        return {
            "type_expanded":self.type_expanded,
            "images":self.images,
            "description": self.description
            }


class Furniture(db.Document):
    type = db.StringField()
    type_expanded = db.StringField()
    images = db.ListField(db.StringField())

    priority = db.IntField()
    owner = db.StringField()
    description = db.StringField()
    questions = db.StringField()

    def to_json(self):
        return json.dumps({
            "type":self.type,
            "type_expanded":self.type_expanded,
            "images":self.images,
            "owner":self.owner,
            "description":self.description,
            "questions":self.questions
        }, indent=5)

class Room(db.Document):
    """
    Class Room
    """
    verified = db.ListField(db.BooleanField())
    number = db.IntField()
    names = db.ListField(db.StringField())
    start_dates = db.ListField(db.StringField())
    finish_dates = db.ListField(db.StringField())
    furniture_list = db.ListField(db.ListField(db.ReferenceField(Furniture)))
    filled_form = db.ListField(db.BooleanField())

    def shorten_room(self):
        """
        Returns shorten info about room
        """
        new_room={}
        new_room["id"]=str(self.id)
        new_room["number"]=self.number
        new_room["verified"]=self.verified
        new_room["filled_form"]=self.filled_form
        return new_room

    def to_json(self):
        new_list = []
        for list_furniture in self.furniture_list:
            small_list = []
            for furniture in list_furniture:
                small_list.append(json.loads(furniture.to_json()))
            new_list.append(small_list)
        
        return {
            "number":self.number,
            "names":self.names,
            "filled_form": self.filled_form,
            "start_dates":self.start_dates,
            "finish_dates":self.finish_dates,
            "furniture_list":new_list,
            "verified": self.verified
        }

    def update_json(self, json_obj, id = None):
        print(id)
        if id is None:
            self.number = json_obj["number"]
            self.names = json_obj["names"]
            self.start_dates = json_obj["start_dates"]
            self.finish_dates = json_obj["finish_dates"]
            self.filled_form = json_obj["filled_form"]
            self.verified = json_obj["verified"]

            for furniture_lists in zip(self.furniture_list, json_obj["furniture_list"]):
                for furniture in zip(furniture_lists[0], furniture_lists[1]):
                    if furniture[0].description != furniture[1]["description"]:
                        furniture[0].description = furniture[1]["description"]
                    if furniture[0].owner != furniture[1]["owner"]:
                        furniture[0].owner = furniture[1]["owner"]
                    if furniture[0].images != furniture[1]["images"]:
                        furniture[0].images = furniture[1]["images"]
                    furniture[0].save()
        else:
            if int(id)>0:
                self.start_dates[int(id) - 3] = json_obj["start_dates"][int(id) - 3]
                self.finish_dates[int(id) - 3] = json_obj["finish_dates"][int(id) - 3]
                self.verified[int(id) - 2] = json_obj["verified"][int(id) - 2]
                self.names[int(id) - 3] = json_obj["names"][int(id) - 3]
                self.filled_form[int(id) - 2] = json_obj["filled_form"][int(id) - 2]
                for furniture in zip(self.furniture_list[int(id)], json_obj["furniture_list"][int(id)]):
                    if furniture[0].description != furniture[1]["description"]:
                        furniture[0].description = furniture[1]["description"]
                    if furniture[0].owner != furniture[1]["owner"]:
                        furniture[0].owner = furniture[1]["owner"]
                    if furniture[0].images != furniture[1]["images"]:
                        furniture[0].images = furniture[1]["images"]
                    furniture[0].save()
            elif int(id) == 0:
                self.verified[0] = json_obj["verified"][0]
                self.filled_form[0] = json_obj["filled_form"][0]
                for i in range(0, 3):
                    for furniture in zip(self.furniture_list[i], json_obj["furniture_list"][i]):
                        if furniture[0].description != furniture[1]["description"]:
                            furniture[0].description = furniture[1]["description"]
                        if furniture[0].owner != furniture[1]["owner"]:
                            furniture[0].owner = furniture[1]["owner"]
                        if furniture[0].images != furniture[1]["images"]:
                            furniture[0].images = furniture[1]["images"]
                        furniture[0].save()
            # print([i.description for i in self.furniture_list[int(id)]])

    def verify(self, index):
        if self.verified[index] is False:
            self.verified[index] = True
        else:
            self.verified[index] = False

    def fill(self, index):
        if self.filled_form[index] is False:
            self.filled_form[index] = True
        else:
            self.filled_form[index] = False

class Report_Row(db.Document):
    name = db.StringField()
    time_start = db.StringField()
    time_finish = db.StringField()
    room_number = db.IntField()
    room_furn = db.ListField(db.ReferenceField(SaveFurn))

    def to_json(self):
        return [
            self.room_number,
            self.time_start,
            self.time_finish,
            self.name,
            *self.room_furn

        ]

class Report(db.Document):
    rows = db.ListField(db.ReferenceField(Report_Row))

    def add_row(self, name, start, end, room, index):
        # a = set()
        # for furn in Furniture.objects():
        #     a.add(furn.type_expanded)
        # print(a)
        # print("Testing")

        furniture = []
        for my_room in room.furniture_list[:3]:
            for element in my_room:
                furniture.append(element)
        # furniture.extend(room.furniture_list[index])
        save_furn = []
        for element in furniture + room.furniture_list[index]:
            save_element = SaveFurn(description = element.description, type_expanded = element.type_expanded, images = element.images)
            save_furn.append(save_element)
            save_element.save()
        # print([i.type_expanded for i in furniture])
        # print([i.description for i in furniture])

        # print("furniture")

        new_row = Report_Row(name = name, time_start = start, time_finish = str(end), room_furn = save_furn, room_number = room.number)
        new_row.save()
        self.update(rows=[*self.rows, new_row])
        # print([i.description for i in self.rows[-1].room_furn])
        # print([i.description for i in self.rows[-1][4:]])
        self.save()

    def to_json(self):
        data_rows = [row.to_json() for row in self.rows]
        # print([i.description for i in data_rows[-1][4:]])
        return {
            "rows":data_rows
        }

class User(db.Document):

    uid = db.StringField(primary_key=True)
    public_key = db.StringField(unique = True, default = lambda: str(uuid.uuid4()))
    user_type = db.StringField()
    email = db.StringField(unique = True)
    password = db.StringField()
    rooms = db.ListField(db.ReferenceField(Room, dbref = False))
    def to_json(self, full_info):
        if full_info:
            return ({
                "rooms": [json.loads(room.to_json()) for room in self.rooms],
                "uid":self.uid,
                "user_type":self.user_type,
                "email":self.email
            })
        else:
            numbers= [room.number for room in self.rooms]
            return ({
                "rooms": [min(numbers),max(numbers)],
                "user_type":self.user_type,
                "email":self.email
            })

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[-1]
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.objects(public_key = data["public_key"]).first()
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        return  f(current_user, *args, **kwargs)
  
    return decorated
  


@app.route("/create_admin")
# @token_required
def create_admin():
    rooms_user = []
    for sets in ["422", "423", "424", "425", "426", "427"]:
        for room_number in range(int(sets[0]), int(sets[1]) + 1):
            rooms_user += [Room.objects(number = room_number).first()]
    user_admin = User(user_type = "ADMIN", uid = "ZN9kWTtfexdxQTb0CsumNdl91NL2",email = "admin@gmail.com",  password = "admin")
    user_admin.save()
    return "done"


@app.route("/create_user", methods = ["POST"])
@token_required
def create_user_endpoint():
    data = json.loads(request.data.decode("utf-8"))
    rooms = [wing.split("-") for wing in data["rooms"].split(",")][:-1]
    rooms_user = []
    for sets in rooms:
        for room_number in range(int(sets[0]), int(sets[1]) + 1):
            rooms_user += [Room.objects(number = room_number).first()]

    new_user = User(uid = data["uid"], email = data["email"] , user_type = data["role"] , rooms = rooms_user)
    new_user.save()
    return "user_created"


@app.route("/login", methods = ["POST"])
@cross_origin()
def login():
    data = json.loads(request.data.decode("utf-8"))
    user = User.objects(email = data["email"]).first()
    # print(user)
    if user:
        token = jwt.encode({
            'public_key': user.public_key,
            'expiration': str(datetime.utcnow() + timedelta(minutes = 1))
        },
        app.config['SECRET_KEY'])
        return jsonify({"user_type": user.user_type, "token": token})
    else:
        return "Invalid credentials"
    

@app.route("/curators")
@token_required
@cross_origin()
def curators():
    users = User.objects().all()
    jsoned = [user.to_json(False) for user in users]
    return jsoned

@app.route("/curator_rooms/<id>")
@token_required
@cross_origin()
def get_rooms(user, id):
    print(id)
    user = User.objects(uid = id).first()
    rooms = [room.shorten_room() for room in user.rooms]
    print(rooms)
    return rooms
@app.route("/room_n/<number_room>")
@cross_origin()
def get_room(number_room):
    """
    Gets room by id
    """
    room = Room.objects(number=number_room).first()
    return room.to_json()

@app.route("/add")
@cross_origin()
def hello():
    for floor in range(2, 6):
        for number_room in range(floor*100 + 1, floor*100 + 35):
            
            furniture1_1 = Furniture(type= "door", type_expanded = "Вхідні двері", questions = "Детально огляньте двері. Перевірте ручку, справність замка, стан дверного полотна.",priority = 1)
            furniture1_1.save()
            furniture1_2 = Furniture(type= "basebord",type_expanded = "Плінтус", questions = "Ретельно огляньте плінтус.", priority = 2)
            furniture1_2.save()
            furniture1_3 = Furniture(type= "wardrobe",type_expanded = "Шафа", questions = "Перейдімо до шафи, що розташована біля вхідних дверей, огляньте всі полички та перевірте справність механізмів.", priority = 3)
            furniture1_3.save()
            furniture1_4 = Furniture(type= "fridge", type_expanded = "Холодильник", questions = "А тепер — до холодильника. Відсуньте його, огляньте  ззовні та зсередини, роздивіться полички та поверхні, решітки, а також уважно огляньте тумбу, у якій він стоїть.", priority = 4)
            furniture1_4.save()
            furniture1_5 = Furniture(type= "wall ganok", type_expanded = "Стіни передпокою", questions = "Огляньте стіни навколо холодильника та дверей.", priority = 5)
            furniture1_5.save()
            furniture1_6 = Furniture(type= "ceiling ganok", type_expanded = "Стеля передпокою", questions = "Перевірте, чи не пошкоджені касетони, вентиляційні решітки.", priority = 6)
            furniture1_6.save()
            furniture1_7 = Furniture(type= "floor ganok", type_expanded = "Підлога передпокою", questions = "Перевірте, чи не пошкоджений лінолеум.", priority = 7)
            furniture1_7.save()

    #main directory

            furniture1_8 = Furniture(type= "shelf",type_expanded = "Шухляди під ліжками", questions = "Перейдімо до шухляд під ліжками, висуньте їх повністю, огляньте уважно механізми, коліщата.", priority = 8)
            furniture1_8.save()
            furniture1_9 = Furniture(type= "wardrobe_bed", type_expanded = "Шафи біля ліжок", questions = "Огляньте шафи-стелажі біля ліжок, детально роздивіться кожну поличку та дверцята.", priority = 9)
            furniture1_9.save()
            furniture1_10 = Furniture(type= "windows", type_expanded = "Вікна", questions = "Огляньте підвіконня та віконні рами. Перевірте, чи справні та чисті ролети.", priority = 10)
            furniture1_10.save()
            furniture1_11 = Furniture(type= "table",type_expanded = "Столи та шухляди", questions = "Огляньте столи й усі шухляди, чи справні вони, чи є нерівності, потертості тощо.", priority = 11)
            furniture1_11.save()
            furniture1_12 = Furniture(type= "lamps",type_expanded = "Лампи", questions = "Перевірте, чи працюють лампи на столах.", priority = 12)
            furniture1_12.save()
            furniture1_13 = Furniture(type= "chairs", type_expanded = "Стільці", questions = "Огляньте стільці, зазначте наявні дефекти.", priority = 13)
            furniture1_13.save()
            furniture1_14 = Furniture(type= "wardrobe_clothes", type_expanded = "Шафи для одягу", questions = "Перевірте шафи для одягу, огляньте всі полички, відкрийте нижні шухляди, зазначте несправності.", priority = 14)
            furniture1_14.save()
            furniture1_15 = Furniture(type= "wall bedroom", type_expanded = "Стіни спальні", questions = "Також огляньте стіни навколо ліжок й шафи.", priority = 15)
            furniture1_15.save()
            furniture1_16 = Furniture(type= "ceiling bedroom", type_expanded = "Стеля спальні", questions = "Перевірте, чи не пошкоджена стеля, світильник.", priority = 16)
            furniture1_16.save()
            furniture1_17 = Furniture(type= "floor bedroom", type_expanded = "Стеля спальні", questions = "Перевірте, чи не пошкоджений лінолеум.", priority = 17)
            furniture1_17.save()
            furniture1_18 = Furniture(type= "radiator", type_expanded = "Батарея", questions = "Огляньте батарею, решітку та регулятор.", priority = 18)
            furniture1_18.save()
            furniture1_19 = Furniture(type= "socket", type_expanded = "Вимикачі та розетки", questions = "Перевірте всі вимикачі та розетки в кімнаті. Чи справні та не пошкоджені вони?", priority = 19)
            furniture1_19.save()

    #bathroom

            furniture1_20 = Furniture(type= "bathroom", type_expanded = "Двері до вбиральні", questions = "Огляньте двері вбиральні. Перевірте ручку, справність замка, стан дверного полотна.", priority = 20)
            furniture1_20.save()
            furniture1_21 = Furniture(type= "bathroom", type_expanded = "Умивальник", questions = "Огляньте умивальник на тріщини, також роздивіться його знизу. Опишіть змішувач.", priority = 21)
            furniture1_21.save()
            furniture1_22 = Furniture(type= "bathroom", type_expanded = "Дзеркало", questions = "Відчиніть шафку з дзеркалом, огляньте полички, саме дзеркало, а також лампи й плафони", priority = 22)
            furniture1_22.save()
            furniture1_23 = Furniture(type= "bathroom", type_expanded = "Душова кабінка (ванна)", questions = "Огляньте душову кабінку (ванну), шланг, мильничку. Зверніть увагу на змішувач і стійку.", priority = 23)
            furniture1_23.save()
            furniture1_24 = Furniture(type= "bathroom", type_expanded = "Рушникосушка", questions = "Огляньте рушникосушку.", priority = 24)
            furniture1_24.save()
            furniture1_25 = Furniture(type= "bathroom", type_expanded = "Смітник", questions = "Огляньте смітник, чи справний він, чи є пошкодження.", priority = 25)
            furniture1_25.save()
            furniture1_26 = Furniture(type= "bathroom", type_expanded = "Унітаз", questions = "Огляньте унітаз, йоржик і паперотримач.", priority = 26)
            furniture1_26.save()
            furniture1_27 = Furniture(type= "bathroom", type_expanded = "Шафа над унітазом", questions = "Огляньте шафу, полички, перевірте справність дверцят.", priority = 27)
            furniture1_27.save()
            furniture1_28 = Furniture(type= "wall bathroom", type_expanded = "Плитка", questions = "Також огляньте плитку на стінах та підлозі на наявність плям чи тріщин.", priority = 28)
            furniture1_28.save()

    #1

            furniture2_1 = Furniture(type= "bed", type_expanded = "Одноповерхове ліжко", questions = "Огляньте основу ліжка (каркас).", priority = 1)
            furniture2_2 = Furniture(type= "mattress", type_expanded = "Матрац одн. ліжка (верх)", questions = "Огляньте матрац зверху й опишіть усі наявні плями.", priority = 2)
            furniture2_3 = Furniture(type= "mattress", type_expanded = "Матрац одн. ліжка (низ)", questions = "Переверніть та огляньте матрац знизу.", priority = 3)
            furniture2_4 = Furniture(type= "mattress topper", type_expanded = "Наматрацник одн. ліжка (верх)", questions = "Огляньте наматрацник зверху.", priority = 4)
            furniture2_5 = Furniture(type= "mattress topper", type_expanded = "Наматрасник одн. ліжка (низ)", questions = "Огляньте наматрацник знизу.", priority = 5)
            furniture2_6 = Furniture(type= "wall", type_expanded = "Cтіни одн. ліжка", questions = "Огляньте стіни навколо вашого ліжка.", priority = 6)
            furniture2_1.save()
            furniture2_2.save()
            furniture2_3.save()
            furniture2_4.save()
            furniture2_5.save()
            furniture2_6.save()

    #2

            furniture3_1 = Furniture(type= "bed", type_expanded = "Двоповерхове ліжко (1 поверх)", questions = "Огляньте основу ліжка (каркас).", priority = 1)
            furniture3_2 = Furniture(type= "mattress", type_expanded = "Матрац двоповерх. ліжка (верх, 1 поверх)", questions = "Огляньте матрац зверху й опишіть усі наявні плями.", priority = 2)
            furniture3_3 = Furniture(type= "mattress", type_expanded = "Матрац двоповерх. ліжка (низ, 1 поверх)", questions = "Огляньте матрац знизу, перевернувши його.", priority = 3)
            furniture3_4 = Furniture(type= "mattress topper", type_expanded = "Наматрацник двоповерх. ліжка (верх, 1 поверх)", questions = "Огляньте наматрацник зверху.", priority = 4)
            furniture3_5 = Furniture(type= "mattress topper", type_expanded = "Наматрацник двоповерх. ліжка (низ, 1 поверх)", questions = "Огляньте наматрацник знизу.", priority = 5)
            furniture3_6 = Furniture(type= "wall", type_expanded = "Cтіни двоповерх. ліжка (1 поверх)", questions = "Огляньте стіни навколо вашого ліжка.", priority = 6)
            furniture3_1.save()
            furniture3_2.save()
            furniture3_3.save()
            furniture3_4.save()
            furniture3_5.save()
            furniture3_6.save()

    #3

            furniture4_1 = Furniture(type= "bed", type_expanded = "Двоповерхове ліжко (2 поверх)", questions = "Огляньте основу ліжка (каркас).", priority = 1)
            furniture4_2 = Furniture(type= "mattress", type_expanded = "Матрац двоповерх. ліжка (верх, 2 поверх)", questions = "Огляньте матрац зверху й опишіть усі наявні плями.", priority = 2)
            furniture4_3 = Furniture(type= "mattress", type_expanded = "Матрац двоповерх. ліжка (низ, 2 поверх)", questions = "Огляньте матрац знизу, перевернувши його.", priority = 3)
            furniture4_4 = Furniture(type= "mattress topper", type_expanded = "Наматрацник двоповерх. ліжка (верх, 2 поверх)", questions = "Огляньте наматрацник зверху.", priority = 4)
            furniture4_5 = Furniture(type= "mattress topper", type_expanded = "Наматрацник двоповерх. ліжка (низ, 2 поверх)", questions = "Огляньте наматрацник знизу.", priority = 5)
            furniture4_6 = Furniture(type= "wall", type_expanded = "Cтіни двоповерх. ліжка (2 поверх)", questions = "Огляньте стіни навколо вашого ліжка.", priority = 6)
            furniture4_1.save()
            furniture4_2.save()
            furniture4_3.save()
            furniture4_4.save()
            furniture4_5.save()
            furniture4_6.save()

            room1 = Room(verified = [False, False, False, False], filled_form = [False, False, False, False], names=["", "", ""], start_dates=["", "", ""], finish_dates=["", "", ""], number = number_room, furniture_list = [[furniture1_1, furniture1_2,furniture1_3, furniture1_4, furniture1_5, furniture1_6, furniture1_7], [furniture1_8, furniture1_9, furniture1_10, furniture1_11, furniture1_12, furniture1_13, furniture1_14, furniture1_15, furniture1_16, furniture1_17, furniture1_18, furniture1_19], [furniture1_20, furniture1_21, furniture1_22, furniture1_23, furniture1_24, furniture1_25, furniture1_26, furniture1_27, furniture1_28], [furniture2_1, furniture2_2, furniture2_3, furniture2_4, furniture2_5, furniture2_6], [furniture3_1, furniture3_2, furniture3_3, furniture3_4, furniture3_5, furniture3_6], [furniture4_1, furniture4_2, furniture4_3, furniture4_4, furniture4_5, furniture4_6]])
            room1.save()
    
    return "rooms created"

@app.route("/room/<encoded>/submit/<id>", methods = ["POST"])
@cross_origin()
def add_room_info(encoded, id):
    data = request.data.decode("utf-8")
    json4ik = json.loads(data, strict=False)
    
    room_id = (f.decrypt(encoded).decode())
    room = Room.objects(id = room_id).first()
    print(room.to_json())
    
    room.update_json(json4ik, id)
    room.save()
    return "add"



@app.route("/room/<encoded>/delete", methods = ["POST"])
@token_required
@cross_origin()
def delete_room(encoded):

    data = json.loads(request.data.decode("utf-8"))
    room_data = data["currentRoom"]
    index_block = int(data["index_block"])
    # if "leave_date" not in data

    # json4ik = json.loads(room_data, strict=False)
    room_id = f.decrypt(encoded).decode()
    room = Room.objects(id = room_id).first()
    if  3 <= index_block <= 5:
        time = data["leave_date"]
        report = Report.objects().first()
        if not time:
            time = datetime.now(pytz.timezone('Europe/Kyiv')).strftime("%Y/%m/%d")
        # time = datetime.now(pytz.timezone('Europe/Kyiv')).strftime("%Y/%m/%d")
        report.add_row(room.names[index_block - 3], room.start_dates[index_block - 3], time,
                       room, index_block)

    room.update_json(room_data, id=index_block)
    room.save()

    return "add"


@app.route("/download_report", methods = ["POST"])
@token_required
@cross_origin()
def download_report():
    test = []
    # funrniture = Furniture.objects()
    # for i in funrniture:
    #     if i.type_expanded in test:
    #         break
    #     test.append(i.type_expanded)
        
    # print(test)
    report = Report.objects().first()
    return report.to_json()

@app.route("/clear_report", methods = ["POST"])
@token_required
def clear_report():
    report = Report.objects().first()
    Report_Row.objects().delete()
    SaveFurn.objects().delete()
    report.rows = []
    report.save()
    return "report is clear"

@app.route("/validate_token", methods = ["POST"])
@cross_origin()
@token_required
def validate_token(user):
    return jsonify({"response": "add"}), 200

@app.route("/create_report", methods = ["GET"])
@token_required
@cross_origin()
def create_report():
    if Report.objects().first() is None:
        report = Report(rows = [])
        report.save()
    return "add"

@app.route("/verify", methods = ["POST"])
@token_required
@cross_origin()
def verify():
    data = json.loads(request.data.decode("utf-8"))
    user_id = data["u_id"]
    index = data["index"]
    user = User.objects(uid = user_id).first()
    if user.user_type == "USER" or user.user_type == "ADMIN":
        room_number = data["room_n"]
        for room in user.rooms:
            if room.number == room_number:
                room = Room.objects(number = room_number).first()
                room.verify(index)
                room.save()
                return "Verified"
        return "Not room"
    return "Not allowed"

@app.route("/fill", methods = ["POST"])
@cross_origin()
def fill():
    data = json.loads(request.data.decode("utf-8"))
    user_id = data["u_id"]
    index = data["index"]
    user = User.objects(uid = user_id).first()
    room_number = data["room_n"]
    for room in user.rooms:
        if room.number == room_number:
            room = Room.objects(number = room_number).first()
            room.fill(index)
            room.save()
            return "Filled"
        return "Not room"

@app.route("/room/<encoded>")
@cross_origin()
def room_form(encoded):
    try:
        room_id = f.decrypt(encoded).decode()
        room = Room.objects(id = room_id).first()
        if not room:
            raise InvalidToken
    except InvalidToken:
        return "Wrong code",400
    room = Room.objects(id = room_id).first()

    if (room.verified[0] is False) or (room.verified[1] is False) or (room.verified[2] is False) or (room.verified[3] is False):
        return room.to_json()
    return "Already verifyed", 400

@app.route("/get_route", methods = ["POST"])
@cross_origin()
def get_route_to_room():
    number = request.get_json()["room_n"]
    room_id = Room.objects(number = number).first().id
    encoded = f.encrypt(bytes(str(room_id), 'utf-8'))
    return encoded
# Starting app
if __name__=="main":
    app.run()
