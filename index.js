/* sample object
Users={1:{
    username:"Padmapriya",
    email:"padmapriya7897@rediffmail.com",
    city_name:"Madurai",
    mobile_number:8667828001,
    feeds:[]
    followers:[],
    following:[],
    liked_feeds:[],
    unliked_feeds:[]}}

Feeds={1:{
    userid:1,
    message:"",
    hide:true,
}}*/
function ConnectWorld(){}

this.Users={};
this.Id=0;
this.Feeds={};
this.Feed_Id=0;

ConnectWorld.registerUser=(username,email,city_name,mobile_number)=>{
    var response={};
    let already_present=false;
    let keys=Object.keys(Users);
    if(!username|| !email|| !city_name|| !mobile_number)
    {
        response.error="invalid input";
        return response;
    }
    
    for(i=0;i<keys.length;i++)
    {  
        if(Users[keys[i]].email==email)
        {
            response.error="User already Exists"
            already_present=true;
            break;
        }
    }
    
    if(!already_present)
    {
        Id++;
        Users[Id]={username,email,city_name,mobile_number,followers:[],following:[],feeds:[],liked_feeds:[],unliked_feeds:[],blockUser:[]}
        response=Users[Id]
        response.Id=Id;
    }
    return response;
}

ConnectWorld.followUser=(followerId,followeeId)=>{

    const response={};
    if(Users[followeeId] && Users[followeeId])
    {
        Users[followerId].following.push(followeeId);
        Users[followeeId].followers.push(followerId);
        response.message="followed";
    }
    else{
        response.error="userId is invalid"
    }
    return response;
}

ConnectWorld.unfollowUser=(followerId,followeeId)=>{

    const response={};
    if(Users[followeeId] && Users[followeeId])
    {
        let followee_index=Users[followerId].following.indexOf(followeeId);
        Users[followerId].following.splice(followee_index,1);
        let follower_index=Users[followeeId].followers.indexOf(followerId);
        Users[followeeId].followers.splice(follower_index,1);
        response.message="Unfollowed";
    }
    else{
        response.error="userId is invalid"
    }
    return response;
}

ConnectWorld.blockUser=(Current_userId,Block_userId)=>{

    const response={}
    if(Users[Current_userId] && Users[Block_userId])
    {   
        Users[Current_userId].blockUser.push(Block_userId);
        response.message="blocked";
    }
    else{
        response.error="userId is invalid"
    }
    return response;
}

ConnectWorld.postFeed=(userid,content)=>{

    var response={};

    if(content==""){
        response.error="Content is empty to post feed"
    }
    else if(Users[userid])
    {
        Feed_Id++;
        const created_time=Date.now();
        Feeds[Feed_Id]={userid,content,Hide:false,likes:0,dislikes:0,created_time}
        Users[userid].feeds.push(Feed_Id);
        response=Feeds[Feed_Id];
        response.FeedId=Feed_Id;
    }
    else{
        response.error="userId is invalid"
    }
    return response;
}

ConnectWorld.getUserFeeds=(userId)=>{  
    /*
        check if the user has blocked the current user.

       let blockUser=Users[userId].blockUser.indexOf(currentUser);
       if(blockUser!=-1)
       {
            console.log(" User is blocked ");
       }
    */ 
   var response={};
   if(Users[userId])
   {
       var allfeeds=[]
        Users[userId].feeds.forEach((element)=>{
        
            if(!Feeds[element].Hide) //if a user is a current user doesn't need to check this
            {
                allfeeds.push(Feeds[element])
            }
        });
        allfeeds.sort(function(a,b){return b.time-a.time});
        response=allfeeds
   }
   else{
    response.error="userId is invalid"
   }
    return response;
}

ConnectWorld.getFeedLikeCount=(feedId)=>{
    const response={};
    if(Feeds[feedId])
    {
        response.likes=Feeds[feedId].likes;
        response.unlikes=Feeds[feedId].dislikes;
    }
    else
    {
        response.error="feedId is invalid"
    }
    return(response);
}

ConnectWorld.getMyFeeds=(Current_userId)=>{
    var response={};
    if(Users[Current_userId])
    {
        var allfeeds=[]
        Users[Current_userId].feeds.forEach((element)=>{
       
            if(!Feeds[element].Hide)
            {
                allfeeds.push(Feeds[element])
            }
        });

        Users[Current_userId].following.forEach((following_userId)=>{
            Users[following_userId].feeds.forEach((element)=>{

                if(!Feeds[element].Hide) 
                {
                    allfeeds.push(Feeds[element])
                }
            })
        })
        allfeeds.sort(function(a,b){return b.time-a.time});
        response=allfeeds;
    }
    else{
        response.error="userId is invalid"
    }
    return response;
}

ConnectWorld.deleteUser=(user_Id)=>{

    const response={};
    if(Users[user_Id])
    {
        Users[user_Id].followers.forEach((element)=>{
            let index=Users[element].following.indexOf(user_Id);
            Users[element].following.splice(index,1);
        })
    
        Users[user_Id].following.forEach((element)=>{
            let index=Users[element].followers.indexOf(user_Id);
            Users[element].followers.splice(index,1);
        })
    
        Object.keys(Users).forEach((userid)=>{

            Users[user_Id].feeds.forEach((element)=>{
    
                let like_index=Users[userid].liked_feeds.indexOf(element);
                Users[userid].liked_feeds.splice(like_index,1);
    
                let unlike_index=Users[userid].unliked_feeds.indexOf(element);
                Users[userid].unliked_feeds.splice(unlike_index,1);
            })
        })
        
        Users[user_Id].liked_feeds.forEach((element)=>{
            Feeds[element].likes--;
        })
    
        Users[user_Id].unliked_feeds.forEach((element)=>{
            Feeds[element].dislikes--;
        })
    
        Users[user_Id].feeds.forEach((element)=>{
            delete Feeds[element];
        })
       delete Users[user_Id];
       response.message="User Deleted"; 
    }
    else{
        response.error="userId is invalid"
    }
    return response;
  
}

