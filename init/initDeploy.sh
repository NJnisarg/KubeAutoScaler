#!bin/sh

# Enable the kubernetes API server
minikube addons enable metrics-server

# Install linkerd onto the cluster
linkerd install | kubectl apply -f -

# Enable proxying to the K8s API server to access metrics and other APIs
kubectl proxy --port=8080 &

# Injecting linkerd proxies
# kubectl get -n web-app deploy -o yaml \
#  | linkerd inject - \
#  | kubectl apply -f -