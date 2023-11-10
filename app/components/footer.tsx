import Link from "next/link";
import Image from "next/image";
import React from "react";
import Container from "./container";

export default function Footer() {
  const navigation = [
    {
      name: "Documentation",
      link: "https://emanuele-zini.gitbook.io/space-pirates/",
    },
    { name: "Inflation Dashboard", link: "./" },
    {
      name: "Protocol schema",
      link: "https://user-images.githubusercontent.com/79539455/168427909-10ffca5b-da41-4d8b-92e4-230e1f8afa02.png",
    },
    {
      name: "Pitch deck",
      link: "https://pitch.com/public/fa4ab34e-7b4a-49e8-aba5-bda6161fec46",
    },
  ];
  const legal = ["Terms", "Privacy", "Legal"];
  return (
    <div className="relative w-full container">
      <div className="grid grid-cols-1 gap-10 pt-10 mx-auto mt-5 border-t border-base-white lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div>
            {" "}
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-medium"
            >
              <span>Space Pirates</span>
            </Link>
          </div>

          <div className="max-w-md mt-4">
            In Space Pirates, soar through the skies as a pirate on your
            galleon. <br />
            <br />
            Build a team, conquer lands, and establish your base. Enjoy friendly
            battles with friends, collect rare titles, and gather powerful
            gadgets to enhance your team&apos;s abilities.
          </div>
        </div>

        <div>
          <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
            {navigation.map((item, index) => (
              <a
                target="_blank"
                rel="noopener"
                key={index}
                href={item.link}
                className="w-full px-4 py-2 rounded-md hover:text-primary focus:text-primary focus:outline-none focus:bg-neutral"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
            {legal.map((item, index) => (
              <Link
                key={index}
                href="/"
                className="w-full px-4 py-2 rounded-md hover:text-primary focus:text-primary focus:outline-none focus:bg-neutral"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="">
          <div>Follow us</div>
          <div className="flex mt-5 space-x-5 text-gray-500">
            <a href="./" target="_blank" rel="noopener">
              <span className="sr-only">Twitter</span>
              <Twitter />
            </a>
            <a href="./" target="_blank" rel="noopener">
              <span className="sr-only">Facebook</span>
              <Discord />
            </a>
            <a href="./" target="_blank" rel="noopener">
              <span className="sr-only">Instagram</span>
              <Telegram />
            </a>
          </div>
        </div>
      </div>

      <div className="my-6 text-sm text-center">
        Copyright © {new Date().getFullYear()}. - All right reserved by Space
        Pirates Lab
      </div>
    </div>
  );
}

const Twitter = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <title>X</title>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const Discord = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const Telegram = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
  >
    <title>telegram</title>
    <path d="M22.122 10.040c0.006-0 0.014-0 0.022-0 0.209 0 0.403 0.065 0.562 0.177l-0.003-0.002c0.116 0.101 0.194 0.243 0.213 0.403l0 0.003c0.020 0.122 0.031 0.262 0.031 0.405 0 0.065-0.002 0.129-0.007 0.193l0-0.009c-0.225 2.369-1.201 8.114-1.697 10.766-0.21 1.123-0.623 1.499-1.023 1.535-0.869 0.081-1.529-0.574-2.371-1.126-1.318-0.865-2.063-1.403-3.342-2.246-1.479-0.973-0.52-1.51 0.322-2.384 0.221-0.23 4.052-3.715 4.127-4.031 0.004-0.019 0.006-0.040 0.006-0.062 0-0.078-0.029-0.149-0.076-0.203l0 0c-0.052-0.034-0.117-0.053-0.185-0.053-0.045 0-0.088 0.009-0.128 0.024l0.002-0.001q-0.198 0.045-6.316 4.174c-0.445 0.351-1.007 0.573-1.619 0.599l-0.006 0c-0.867-0.105-1.654-0.298-2.401-0.573l0.074 0.024c-0.938-0.306-1.683-0.467-1.619-0.985q0.051-0.404 1.114-0.827 6.548-2.853 8.733-3.761c1.607-0.853 3.47-1.555 5.429-2.010l0.157-0.031zM15.93 1.025c-8.302 0.020-15.025 6.755-15.025 15.060 0 8.317 6.742 15.060 15.060 15.060s15.060-6.742 15.060-15.060c0-8.305-6.723-15.040-15.023-15.060h-0.002q-0.035-0-0.070 0z"></path>
  </svg>
);
