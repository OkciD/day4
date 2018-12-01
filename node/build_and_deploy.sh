#!/usr/bin/env bash

sudo docker build -t team02_day4_node ./
sudo docker tag team02_day4_node icp.bmstu.ru:8500/team02/team02_day4_node
sudo docker push icp.bmstu.ru:8500/team02/team02_day4_node
kubectl run team02node --image=icp.bmstu.ru:8500/team02/team02_day4_node
kubectl expose deployment team02node --name=team02-node-http --type=LoadBalancer --port=80 --target-port=80
kubectl expose deployment team02node --name=team02-node-ssh --type=LoadBalancer --port=22 --target-port=22
kubectl get svc