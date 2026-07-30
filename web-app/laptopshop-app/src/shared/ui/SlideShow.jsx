import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import banner1 from '../../assets/banner/laptop_ai.webp';
import banner2 from '../../assets/banner/laptop_gaming.webp';

export default function HeroShow() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel
            fade
            pause="hover"
            activeIndex={index}
            onSelect={handleSelect}
            className="shadow-sm rounded-3 overflow-hidden"
            style={{ height: "210px" }}
        >
            <Carousel.Item interval={4000}>
                <img
                    src={banner1}
                    alt="laptop ai"
                    className="w-100 d-block"
                    style={{ objectFit: "cover" }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-50 rounded-3 p-1">
                    <h3>Laptop Chuyên AI</h3>
                    <p>Tích hợp NPU, tối đa trải nghiệm với tác vụ AI</p>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={4000}>
                <img
                    src={banner2}
                    alt="laptop gaming"
                    className="w-100 d-block"
                    style={{ objectFit: "cover" }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-50 rounded-3 p-1">
                    <h3>Laptop Gaming Hiệu Năng Cao</h3>
                    <p>Mạnh mẽ, bền bỉ.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}
