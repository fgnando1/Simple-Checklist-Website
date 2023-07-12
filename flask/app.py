from flask import Flask, request
from flask_restful import Api, Resource, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
api = Api(app)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isChecked = db.Column(db.Boolean, default=False)
    description = db.Column(db.String(100), nullable=False)
    timeCreated = db.Column(db.DateTime, default=datetime.utcnow)

resource_fields = {
    'id': fields.Integer,
    'isChecked': fields.Boolean,
    'description': fields.String,
    'timeCreated': fields.DateTime(dt_format='iso8601')
}

class TodoList(Resource):
    @marshal_with({ 'tasks': fields.List(fields.Nested(resource_fields))})
    def get(self):
        result = Task.query.all();
        return {'tasks': result }, 200
    
    def post(self):
        data = request.get_json()
        description = data["description"]
        task = Task(description = description)
        db.session.add(task)
        db.session.commit()
        return {'message': 'Task created successfully'}, 201

    def put(self):
        data = request.get_json()
        description = data["description"] if "description" in data else None
        isChecked = data["isChecked"] if "isChecked" in data else None
        task = Task.query.get(data["id"])
        if isChecked != None:
            task.isChecked = isChecked
        if description != None:
            task.description = description
        db.session.commit()
        return {'message' : 'Task updated successfully'}, 200

    def delete(self):
        taskId = request.args.get('id')
        task = Task.query.get(taskId)
        db.session.delete(task)
        db.session.commit()
        return {'message' : 'Task deleted successfully'}, 200

api.add_resource(TodoList, '/todo')

if __name__ == '__main__':
    app.run()