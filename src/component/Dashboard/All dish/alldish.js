import React from "react";
import Food from "../../foodimage";
import Footer from "../footer/footer";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import Header from "../header/header";
import { addTocart } from "../cart/cartslice";
import { useDispatch,useSelector } from "react-redux";
import { getTotals } from "../cart/cartslice";
import { getFoodData } from "../../../api/foodimage";

function Alldish(){
    const [food, setFood] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const data = await getFoodData();
        setFood(data);
      };
  
      fetchData();
    }, []);
    const dispatch=useDispatch()
    const history=useHistory();
    const location=useLocation();
    const [detail,setdetail]=useState([])
    useEffect(()=>{
        let data = food.filter((ele)=>ele.titleId==query.get('id'));
        console.log(data)
        setdetail(data)
       
    },[])
    const cart=useSelector((state)=>state.cart)
    useEffect(()=>{
        
        dispatch(getTotals())
    },[cart,dispatch])
    let query = new URLSearchParams(location.search)
    function detailed(id){
        history.push(`/singledish?id=${id}`)
    }
    function order(ele){
        dispatch(addTocart(ele));
        history.push('/order')
    }
    function AddtoCart(ele){
        dispatch(addTocart(ele))
    }
    return(
        <div className="sfp-bg">
            <Header />
           
            <div className="All-dish-card">
            {
                detail.map((ele)=>{
                    return <div key={ele.id} className='Perslide'>
                    <img src={ele.url} alt={ele.title} onClick={()=>detailed(ele.id)}></img>
                    <p>{ele.title}{' '}[{ele.quantity}]</p>
                    <span style={{display:'block'}}>₹{ele.rate}</span>
                    <button className="slide-cart-button" onClick={() => order(ele)}>Order</button>{'  '}<button className="slide-cart-button" onClick={()=>AddtoCart(ele)}>+Add toCart</button>
                </div>
                
                })
            }
            </div>
             
            <Footer />
        </div>
    )
}

export default Alldish