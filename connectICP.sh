CLUSTERNAME=bmstu.ru
ACCESS_IP=195.19.40.201
USERNAME=team02
PASSWD=92099

token=$(curl -s -k -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -d "grant_type=password&username=$USERNAME&password=$PASSWD&scope=openid" https://$ACCESS_IP:8443/idprovider/v1/auth/identitytoken --insecure | jq .id_token | awk  -F '"' '{print $2}')

kubectl config set-cluster icp.$CLUSTERNAME --server=https://$ACCESS_IP:8001 --insecure-skip-tls-verify=true
kubectl config set-context icp.$CLUSTERNAME-context --cluster=icp.$CLUSTERNAME
kubectl config set-credentials $USERNAME --token=$token
kubectl config set-context icp.$CLUSTERNAME-context --user=$USERNAME --namespace=$USERNAME
kubectl config use-context icp.$CLUSTERNAME-context
