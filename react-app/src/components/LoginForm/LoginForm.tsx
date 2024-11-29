import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { message, Typography } from "antd";
import loginImg from "../../assets/img/login-image.png";

interface TForm {
    email: string;
    password: string;
}

const { Title, Text, Link } = Typography;

const LoginForm: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const schema = yup.object().shape({
        email: yup.string().email("Invalid email").required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(25, "Password maximum 25 characters")
            .required("Password id required"),
    });

    const {
        register,
        handleSubmit, reset,
        formState: { errors },
    } = useForm<TForm>({ resolver: yupResolver(schema) });

    const onSubmit = async (values: TForm) => {
        try {
            const response = await axios.post(
                "https://api.escuelajs.co/api/v1/auth/login",
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 201) {
                messageApi
                    .open({
                        type: "loading",
                        content: "Login in progress...",
                        duration: 1.5,
                    })
                    .then(() => message.success("Login successful", 1.5));
                reset()
            } else {
                message.error("Invalid email or password");
            }
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            message.error("Invalid email or password");
        }
    };
    return (
        <>
            {contextHolder}
            <div className="login-container">
                <div className="login-content">
                    <div className="login-image">
                        <img
                            src={loginImg}
                            alt="Login-img"
                        />
                    </div>

                    <div className="login-form-wrapper">
                        <Title level={3} className="login-title">
                            Login Form
                        </Title>
                        <Text className="login-subtitle">Please enter your account to login</Text>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <input type="email"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                />
                                {errors.email && <Text type="danger">{errors.email.message}</Text>}
                            </div>
                            <div className="form-group">
                                <input prefix="" type="password" className="py-2"
                                    placeholder="Enter your password"
                                    {...register('password')}
                                />

                                {errors.password && <Text type="danger">{errors.password.message}</Text>}
                            </div>
                            <button type="submit"
                                className="login-button">
                                Login
                            </button>
                        </form>
                        <div className="login-footer">
                            <Text>
                                Forgot <Link href="#">password</Link> ?
                            </Text> <br />
                            <Text>
                                Create an account ? <Link href="#">Signup</Link>
                            </Text>
                        </div>
                    </div>
                </div>
            </div>







        </>
    );
};

export default LoginForm;
