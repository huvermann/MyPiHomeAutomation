import unittest

class Test_tests(unittest.TestCase):
    def test_A(self):
        # self.fail("Not implemented")
        self.assertEqual(1,1,"Expected to be equal")

if __name__ == '__main__':
    unittest.main()
