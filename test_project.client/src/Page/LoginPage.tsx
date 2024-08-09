import { useState } from "react";
import { useForm } from "react-hook-form";
import { ILoginDto } from "../types/auth.types";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Button from "../Componet/genral/Button";

const LoginPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
        reset,
    } = useForm<ILoginDto>({
        mode: "onChange",
      defaultValues: {
          Username: '',
          Password: '',
      },
    });
  

    const onSubmit = async (data2: ILoginDto) => {
      try {
          const header = { "Content-Type": "application/x-www-form-urlencoded" };
        const data =  new URLSearchParams();
       const client_id = "test_spa"
       const scope = "openid email profile roles offline_access";

       data.append("client_id",client_id);
          data.append("grant_type", "password");
          data.append("username", data2.Username);
          data.append("password", data2.Password);
          data.append("scope", scope);
        
      
        setLoading(true);
        await axios.post("https://localhost:7134/connect/token", data, { headers: header });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const err = error as { data: string; status: number };
        const { status } = err;
        if (status === 401) {
          toast.error('Invalid Username or Password');
        } else {
          toast.error('An Error occurred. Please contact admins');
        }
      }
    }
   
    return (
      <div className="pageTemplate1">
            <form onSubmit={handleSubmit((data) =>{onSubmit(data)})} className="test1">
  
          <h1 className="text-4xl font-bold mb-2 text-[#754eb4]">Login</h1>
          
          <div className="px-4 my-2 w-9/12">
  
           <label className="font-semibold">USER NAME</label>
            <br />
            <input
             type="text"
             {...register("Username",{required:"userName is required",minLength:{value:4,message:"Minimum lenght is 4"}})}
             className="test2"
            />
            {errors.Username && <span className="text-red-600 font-semibold">{errors.Username.message}</span>}
            <br />
            <br /> 
  
            <label className="font-semibold">PASSWORD</label>
            <br />
            <input 
             type="password" 
             {...register("Password",{required:"password is required",minLength:{value:6,message:"Minimum lenght is 6"}})}
             className="test2"
            />
            {errors.Password && <span className="text-red-600 font-semibold">{errors.Password.message}</span>}
            <br />
            <br />
  
            <div className="flex gap-2">
              <h1>Don't have an account?</h1>
              <Link to={"/register"} className="test3">
                Register
              </Link>
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button variant='secondary' type='button' label='Reset' onClick={() => reset()}/>
              <Button variant='secondary' type='submit' label='Login' onClick={() => {errors}} loading={loading}/>
            </div>
  
          </div>
        </form>
      </div>
    );
  };
  
  export default LoginPage;