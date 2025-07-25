import React, { useEffect, useState } from "react";
import Food from "../../../foodimage";
import '../categories/categories.css'
import indian from '../../image/indianfood.jpg'
import italian from '../../image/italianfood.jpg'
import korean from '../../image/korean.png'
import { useHistory } from "react-router-dom";
import { getFoodData } from "../../../../api/foodimage";
function Categories(){
    const [food, setFood] = useState([]);
    console.log(food, "food")

    useEffect(() => {
      const fetchData = async () => {
        const data = await getFoodData();
        setFood(data);
      };
  
      fetchData();
    }, []);
    const history=useHistory()
    let Food1=food.filter((ele)=>ele.titlename==='IndianFood');
    let Food2=food.filter((ele)=>ele.titlename==='ItalianFood');
    let Food3=food.filter((ele)=>ele.titlename==='korean');
    function Alldish(titleId){
        history.push(`/alldish?id=${titleId}`)
    }
    return (
        <div className="category-list">
           <h2>Categories</h2>
           <div className="category-main">
           <div><img src={indian} alt='Indian' onClick={()=>Alldish(Food1[0].titleId)} ></img>
           <p >Indian cuisins</p></div> 
           <div><img src={italian} alt='italian' onClick={()=>Alldish(Food2[0].titleId) }  ></img>
           <p>Italian cuisins</p></div> 
           <div><img src={korean} alt='korean'  onClick={()=>Alldish(Food3[0].titleId) } ></img>
           <p>Korean cuisins</p></div>
           </div>
        </div>
    )
}
export default Categories