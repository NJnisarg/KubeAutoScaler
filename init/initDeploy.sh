#!bin/sh

# create a single instance of service and deployment
kubectl apply -f deployment_template/depl.yml
kubectl apply -f deployment_template/svc.yml

# Enable the kubernetes API server
minikube addons enable metrics-server

# Enable proxying to the K8s API server to access metrics and other APIs
kubectl proxy --port=8080 &