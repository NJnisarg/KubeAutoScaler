import time
from locust import HttpUser, task

class QuickstartUser(HttpUser):

    @task
    def image_resize(self):
        self.client.post("/imageResize", json={"imgUrl": "https://www.rd.com/wp-content/uploads/2019/01/shutterstock_673465372.jpg"})