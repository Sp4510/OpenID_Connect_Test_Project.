import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IRegisterDto } from "../types/auth.types";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../Componet/genral/Button";

const RegisterPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const {
      register,
      handleSubmit,
      watch,
      formState: {errors},
      reset,
    } = useForm<IRegisterDto>({mode:"onChange",
      defaultValues:{
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
      },
    });
  
    const onSubmit = async(data:IRegisterDto) => {
      try {
        setLoading(true);
        await axios.post("https://localhost:7134/api/Auth/register",data);
        setLoading(false);
        toast.success("Register was Successfull");
          navigate("/");
  
      } catch (error) {
        setLoading(false);
        const err = error as { data: string; status: number };
        const { status, data } = err;
        if (status === 400 || status === 409) {
          toast.error(data);
        } else {
          toast.error("An Error occurred. Please contact admins");
        }
      }
  
    };
    
    return (
      <div className="pageTemplate1">
        <form onSubmit={handleSubmit(onSubmit)} className="test1">
  
          <h1 className="text-4xl font-bold mb-2 text-[#754eb4]">Register</h1>
  
          <div className="px-4 my-2 w-9/12">
            <label className="font-semibold">USER NAME</label>
            <br />
            <input
             type="text"
             {...register("username",{required:"userName is required",minLength:{value:4,message:"Minimum lenght is 4"}})}
             className="test2"
            />
            {errors.username && <span className="text-red-600 font-semibold">{errors.username.message}</span>}
            <br />
            <br /> 
  
            <label className="font-semibold">EMAIL</label>
            <br />
            <input 
             type="text"
             {...register("email",{required:"email is required",pattern:{value:/^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/,message:'enter valid email...'}})}
             className="test2"
            />
            {errors.email && <span className="text-red-600 font-semibold">{errors.email.message}</span>}
            <br />
            <br />
  
            <label className="font-semibold">PASSWORD</label>
            <br />
            <input 
             type="password" 
             {...register("password",{required:"password is required",minLength:{value:6,message:"Minimum lenght is 6"}})}
             className="test2"
            />
            {errors.password && <span className="text-red-600 font-semibold">{errors.password.message}</span>}
            <br />
            <br />
  
            <label className="font-semibold">CONFIRM PASSWORD</label>
            <br />
            <input 
             type="password"
             {...register("confirmPassword",{required:"confirmPassword is required",minLength:{value:6,message:"Minimum lenght is 6"},validate:(value:string)=>{
              if(watch('password')!=value){
                return "Passwords do not match";  
              }
             }})}
             className="test2"
            />
            {errors.confirmPassword && <span className="text-red-600 font-semibold">{errors.confirmPassword.message}</span>}
            <br />
            <br /> 
  
            <div className="flex gap-2">
              <h1>Already Have an account?</h1>
              <Link to = {"/"} className="test3">
               Log in
              </Link>
            </div>
          
            <div className='flex justify-center items-center gap-4 mt-6'>
              <Button variant='secondary' type='button' label='Reset' onClick={() => reset()} />
              <Button variant='secondary' type='submit' label='Register' onClick={() => {errors}} loading={loading}/>
            </div>
  
          </div>
        </form>
      </div>
    );
  };
  
  export default RegisterPage;