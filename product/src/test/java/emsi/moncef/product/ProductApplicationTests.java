package emsi.moncef.product;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductApplicationTests {

    @Test
    void CreateProductTest() {
    }

    @Test
    void ListProductTest() {
    }

    @Test
    void SmokeTest() {
        assert true;
    }

    @Test
    void XTest() {
    }

    @Test
    void CompressionTest() {
    }

    @Test
    void SurchargeTest() {
    }

}
